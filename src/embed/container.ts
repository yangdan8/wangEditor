/**
 * @description 生成 embed element
 * @author wangfupeng
 */

import $, { DomElement } from '../utils/dom-core'
import { IEmbed } from './IEmbed'
import Editor from '../editor/index'

/**
 * 生成卡片右下角的 enter 按钮
 * @param embedInstance embed 实例
 */
function genEnterButton(embedInstance: IEmbed): DomElement {
    const id = embedInstance.id
    const $btn = $(`<button data-name="enter" data-embed-id="${id}"
        class="we-embed-card-block-enter">回车换行</button>`)
    return $btn
}

/**
 * 生成 embed container tooltip
 * @param embedInstance embed 实例
 * @returns elem
 */
function genBlockContainerTooltip(embedInstance: IEmbed): DomElement | null {
    if (embedInstance.isBlock === false) return null
    const id = embedInstance.id

    const $tooltipContainer = $('<div class="we-embed-card-block-tooltip"></div>')

    // “删除”按钮
    const $deleteBtn = $(`<button data-name="delete" data-embed-id="${id}"
        class="we-embed-card-block-del">删除卡片</button>`)
    $tooltipContainer.append($deleteBtn)

    return $tooltipContainer
}

/**
 * 生成 embed 容器 elem
 * @param embedInstance embed 实例
 * @returns elem
 */
export function genEmbedContainerElem(embedInstance: IEmbed): DomElement {
    const id = embedInstance.id
    const isBlock = embedInstance.isBlock

    // block
    let tag = 'div'
    let className = 'we-embed-card-block'
    // inline
    if (isBlock === false) {
        tag = 'span'
        className = 'we-embed-card-inline'
    }

    // 生成 $container 。注意 id 必须这样写，否则找不到 embedInstance.$container
    const containerHtml = `<${tag} id="${id}" data-we-embed-card class="${className}" contenteditable="false"></${tag}>`
    const $container = $(containerHtml)

    // 追加 tooltip
    if (isBlock) {
        const $tooltip = genBlockContainerTooltip(embedInstance)
        if ($tooltip != null) $container.append($tooltip)
    }

    // 追加“回车”按钮
    if (isBlock) {
        const $enterBtn = genEnterButton(embedInstance)
        $container.append($enterBtn)
    }

    return $container
}

// ----------------------------- 分割线 -----------------------------

/**
 * embed 卡片下创建一个新的空行
 * @param $container embed $container
 * @param editor editor
 */
function createNewP($container: DomElement, editor: Editor) {
    const $p = $('<p><br/></p>')
    $p.insertAfter($container)
    editor.selection.createRangeByElem($p, true)
    editor.selection.restoreSelection()
}

/**
 * 绑定事件
 * @param editor editor 实例
 */
export function bindEvent(editor: Editor): void {
    editor.$textContainerElem.on('click', (event: MouseEvent) => {
        const $target = $(event.target)
        const embedId = $target.attr('data-embed-id') || ''
        const embedInstance = editor.embed.getEmbedInstance(embedId)
        if (embedInstance == null) return

        const $container = embedInstance.$container

        // embed 删除
        if ($target.attr('data-name') === 'delete') {
            // 创建空行，定位选区
            createNewP($container, editor)

            // 删除 elem
            $container.remove()

            // 注意：不能删除 embed 实例 ！！！
            // 如果删除，撤销，再删除。此时将找不到 embed 实例
        }

        // embed 回车换行
        if ($target.attr('data-name') === 'enter') {
            createNewP($container, editor)
        }
    })
}
