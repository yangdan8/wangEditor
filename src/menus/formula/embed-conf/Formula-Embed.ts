/**
 * @description formula embed card class
 * @author wangfupeng
 */

import katex from 'katex'
import 'katex/dist/katex.min.css'

import { IEmbed } from '../../../embed/IEmbed'
import { getRandom } from '../../../utils/util'
import $, { DomElement } from '../../../utils/dom-core'
import { EMBED_KEY } from './const'

class FormulaEmbed implements IEmbed {
    id: string
    public embedKey: string = EMBED_KEY
    public isBlock: boolean = false // display: inline-block
    public data: string = ''

    constructor(data: string) {
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
        const data = this.data as string
        const html = katex.renderToString(data, {
            throwOnError: false,
        })
        return $(html)
    }
    /**
     * 获取 result html ，执行 txt.html() 时触发
     * @returns html 代码
     */
    public genResultHtml(): string {
        const embedKey = this.embedKey
        const data = this.data

        // 要和 selector getData() 对应好
        return `<span data-embed-key="${embedKey}" data-embed-value="${data}"></span>`
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

export default FormulaEmbed
