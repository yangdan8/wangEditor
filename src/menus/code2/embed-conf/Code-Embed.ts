/**
 * @description code embed
 * @author wangfupeng
 */

import codeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'
import 'codemirror/mode/javascript/javascript'

import { IEmbed } from '../../../embed/IEmbed'
import { getRandom } from '../../../utils/util'
import $, { DomElement } from '../../../utils/dom-core'
import { EMBED_KEY } from './const'
import { IData } from './IData'

class CodeEmbed implements IEmbed {
    id: string
    public embedKey: string = EMBED_KEY
    public isBlock: boolean = true // display: block
    public data: IData
    private codeEditorInstance: any = null

    constructor(data: IData) {
        this.id = getRandom(`${EMBED_KEY}-`) // id 会对应到 embed 容器的 DOM 节点
        this.data = data
    }
    public get $container(): DomElement {
        return $(`#${this.id}`)
    }
    /**
     * 渲染代码块
     * @param $container embed 容器
     */
    public render($container: DomElement): void {
        // 设置语言
        const $langSelectContainer = $('<div></div>')
        $langSelectContainer.css('padding', '5px 10px')
        $langSelectContainer.css('background', '#f1f1f1')
        const $langSelect = $(`<select>
            <option>javascript</option>
            <option>java</option>
            <option>python</option>
        </select>`)
        $langSelect.on('change', () => {
            codeEditorInstance.setOption('mode', $langSelect.val())
        })
        $langSelectContainer.append($langSelect)
        $container.append($langSelectContainer)

        // 创建 elem ，加入隐藏的 container
        const $elem = $('<div></div>')
        const id = getRandom('ace-editor-')
        $elem.attr('id', id)
        $elem.css('border-top', '1px solid #ccc')
        $container.append($elem)

        // 创建 AceEditor 实例，并记录
        const { code, lang } = this.data
        const codeEditorInstance = codeMirror(document.getElementById(id) as HTMLElement, {
            lineNumbers: true,
            tabSize: 4,
            value: code,
            mode: lang,
        })
        this.codeEditorInstance = codeEditorInstance
        // AceEditor 的 API 继续参考 https://ace.c9.io/#nav=howto
    }
    /**
     * 获取 result html ，执行 txt.html() 时触发
     * @returns html 代码
     */
    public genResultHtml(): string {
        const codeEditorInstance = this.codeEditorInstance
        const code = codeEditorInstance.getValue()
        const lang = codeEditorInstance.getOption('mode')
        return `<pre><code class="${lang}">${code}</code></pre>` // 语言，写死为 js
    }
    public onClick(event: MouseEvent): void {
        alert(`可以弹出修改 data 的输入框 ${this.id}`)
    }
    public onMouseEnter(event: MouseEvent): void {
        console.log('embed mouse enter')
    }
    public onMouseLeave(event: MouseEvent): void {
        console.log('embed mouse leave')
    }
}

export default CodeEmbed
