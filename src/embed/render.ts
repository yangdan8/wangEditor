/**
 * @description embed render
 * @author wangfupeng
 */

import { DomElement, traversal } from '../utils/dom-core'
import { genEmbedContainerElem } from './container'
import Editor from '../editor/index'

function renderEmbed(editor: Editor): void {
    // ------------ 先关闭 change 监听 ？？？ ------------

    // 遍历编辑区域
    const $textElem = editor.$textElem
    traversal($textElem, ($elem: DomElement) => {
        // 判断是不是 embed，生成 embed 实例
        const embedConf = editor.embed.getEmbedConfByElem($elem)
        if (embedConf == null) return
        const data = embedConf.getDataFromElem($elem)
        const embedInstance = editor.embed.createEmbedInstance(embedConf.key, data)
        if (embedInstance == null) return

        // 生成 $container ，添加到当前元素后面
        const $container = genEmbedContainerElem(embedInstance, editor)
        $container.insertAfter($elem)

        // 调用 embed.render
        embedInstance.render($container)

        // 删除当前元素
        $elem.remove()
    })

    // ------------ 最后再开启 change 监听 ？？？ ------------
}

export default renderEmbed
