/**
 * @description 格式刷 FormatBrush
 * @author liuqh
 *
 */
import BtnMenu from '../menu-constructors/BtnMenu'
import $, { DomElement } from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
import bindEvent from './bind-event/index'

// 保存本次格式刷需要应用的样式
export let styleStr = ''
// 选中的标签是否为标题
export let headTagName = ''

const fontSize = ['', 'x-small', 'small', 'medium', 'large', 'x-large', 'xx-large', 'xxx-large']
class FormatBrush extends BtnMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu" data-title="格式刷">
              <i class="w-e-icon-paint-format"></i>
             </div>`
        )
        super($elem, editor)
        bindEvent(editor)
    }
    /**
     * 菜单点击事件
     * @param e event
     */
    protected clickHandler(e: Event): void {
        // 初始化应用样式
        styleStr = ''
        headTagName = ''
        // 有选中区域
        const editor = this.editor
        const selection = editor.selection
        // 如果处于激活状态证明已经选中了需要的样式,则直接返回
        if (editor.formatActiveFlag) {
            editor.formatActiveFlag = false
            // 取消需要格式化的样式
            styleStr = ''
        } else if (!selection.isSelectionEmpty()) {
            // 更新菜单按钮的激活状态
            editor.formatActiveFlag = !editor.formatActiveFlag
            // 获取当前选中区域
            const selection = editor.selection
            const range = selection.getRange()
            // 获取当前选中区域元素的直接父元素
            const _parentElem = $(range?.startContainer.parentElement!)
            // 获取顶级父元素,即可编辑区域的直接子元素
            const _topElem = _parentElem?.getNodeTop(this.editor)
            // h1~h5标签特殊处理
            if (_topElem.getNodeName().indexOf('H') === 0) {
                headTagName = _topElem.getNodeName().toLowerCase()
            }
            // 处理选中的文字,解析需要格式化的样式
            this.getSelectedStyle(_parentElem, _topElem)

            // 样式提取完毕之后清空选区
            selection.clearWindowSelectionRange()
        }
        // 修改菜单激活状态
        this.tryChangeActive()
    }
    /**
     * 获取选中范围的对应样式
     * @param selectedElem 选中的元素
     * @param topParentElem 选中元素的顶级父元素
     */
    private getSelectedStyle(selectedElem: DomElement, topParentElem: DomElement) {
        // 将选中的特殊标签转化为样式
        this.tagToStyle(selectedElem)
        // 获取标签身上的行内样式
        const _styleStr = selectedElem?.attr('style')
        const _color = selectedElem?.attr('color')
        const _face = selectedElem?.attr('face')
        if (_styleStr) {
            styleStr += _styleStr
        }
        if (_color) {
            styleStr += `color: ${_color};`
        }
        if (_face) {
            styleStr += `font-family: ${_face};`
        }
        // 获取父级元素
        const _parentElem = selectedElem?.parent()
        // 如果选中的是元素就是顶级元素,直接返回不做处理
        if (selectedElem.equal(topParentElem)) {
            return
        }
        // 递归获取样式
        this.getSelectedStyle(_parentElem, topParentElem)
    }
    /**
     * 将选中元素的标签转化为样式
     * @param selectedElem 选中的元素
     */
    private tagToStyle(selectedElem: DomElement) {
        const tagName = selectedElem.getNodeName()
        switch (tagName) {
            case 'STRONG': // 加粗
                styleStr += 'font-weight: bold;'
                break
            case 'B': // 加粗
                styleStr += 'font-weight: bold;'
                break
            case 'I': // 斜体
                styleStr += 'font-style: italic;'
                break
            case 'U': // 下划线
                // 在有删除线的同时,需要兼顾删除线的样式,否则就会直接被覆盖
                if (styleStr.includes('line-through')) {
                    styleStr = styleStr.replace('line-through', 'underline line-through')
                } else {
                    styleStr += 'text-decoration: underline;'
                }
                break
            case 'STRIKE': // 删除线
                if (styleStr.includes('underline')) {
                    styleStr = styleStr.replace('underline', 'underline line-through')
                } else {
                    styleStr += 'text-decoration: line-through;'
                }
                break
            case 'FONT': {
                const size = Number(selectedElem.attr('size'))
                styleStr += `font-size: ${fontSize[size]};`
                break
            }
            default:
                break
        }
    }
    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {
        const editor = this.editor
        if (editor.formatActiveFlag) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default FormatBrush
