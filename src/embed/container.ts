/**
 * @description 生成 embed element
 * @author wangfupeng
 */

import $, { DomElement } from '../utils/dom-core'
import { IEmbed } from './IEmbed'

/**
 * 生成 container html
 * @param embedInstance embed 实例
 * @returns html
 */
export function genEmbedContainerHtml(embedInstance: IEmbed): string {
    const $container = genEmbedContainerElem(embedInstance)
    return $container.outerHtml()
}

/**
 * 生成 container elem
 * @param embedInstance embed 实例
 * @returns elem
 */
export function genEmbedContainerElem(embedInstance: IEmbed): DomElement {
    const id = embedInstance.id
    const $elem = embedInstance.genRenderedElem()

    // block
    let tag = 'div'
    let className = 'we-embed-card-block'
    // inline
    if (embedInstance.isBlock === false) {
        tag = 'span'
        className = 'we-embed-card-inline'
    }

    const containerHtml = `<${tag} id="${id}" data-we-embed-card class="${className}" contenteditable="false"></${tag}>`
    const $container = $(containerHtml)

    //【注意】这里一定要用 append ，才能把 embed 生成的 elem 给**移动**过来
    // append 本质就是移动（不是复制），而这里正需要复制
    $container.append($elem)

    return $container
}

/**
 * 绑定事件
 */
export function bindEvent(): void {
    console.log('绑定 embed container 事件。注意，要用委托，因为 embed 是动态的')
}
