/**
 * @description code embed
 * @author wangfupeng
 */

import codeMirror from 'codemirror'
import 'codemirror/lib/codemirror.css'

import { IEmbed } from '../../../embed/IEmbed'
import { getRandom } from '../../../utils/util'
import $, { DomElement } from '../../../utils/dom-core'
import { EMBED_KEY } from './const'

class CodeEmbed implements IEmbed {
    id: string
    public embedKey: string = EMBED_KEY
    public isBlock: boolean = true // display: block
    public data: string = ''
    private codeEditorInstance: any = null

    constructor(data: any) {
        this.id = getRandom(`${EMBED_KEY}-`) // id 会对应到 embed 容器的 DOM 节点
        this.data = data
    }
    public get $container(): DomElement {
        return $(`#${this.id}`)
    }
    /**
     * 生成 render html 以渲染到编辑区域
     * @returns html 代码
     */
    public genRenderedElem(): DomElement {
        // 创建一个隐藏的 container ，加入到 body
        const $fakeContainer = $('<div id="fake-container"></div>')
        $fakeContainer.css('display', 'none')
        $('body').append($fakeContainer)
        setTimeout(() => {
            // 用完了要删除
            $fakeContainer.remove()
        })

        // 创建 elem ，加入隐藏的 container
        const $elem = $('<div></div>')
        const id = getRandom('ace-editor-')
        $elem.attr('id', id)
        $elem.css('height', '300px') // 高度写写死
        $fakeContainer.append($elem)

        // 创建 AceEditor 实例，并记录
        const data = this.data as string
        const codeEditorInstance = codeMirror(document.getElementById(id) as HTMLElement, {
            lineNumbers: true,
            tabSize: 4,
            value: data,
            mode: 'javascript', // 语言，写死为 js
        })
        this.codeEditorInstance = codeEditorInstance
        // AceEditor 的 API 继续参考 https://ace.c9.io/#nav=howto

        // 返回 elem
        return $elem
    }
    /**
     * 获取 result html ，执行 txt.html() 时触发
     * @returns html 代码
     */
    public genResultHtml(): string {
        const code = this.codeEditorInstance.getValue()
        return `<pre><code class="javascript">${code}</code></pre>` // 语言，写死为 js
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
