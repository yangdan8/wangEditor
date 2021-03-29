/**
 * @description embed class 接口
 * @author wangfupeng
 */

import { DomElement } from '../utils/dom-core'

export interface IEmbed {
    id: string
    embedKey: string
    isBlock: boolean
    data: any
    $content?: DomElement
    readonly $container: DomElement // getter
    render($container: DomElement): void
    genResultHtml(): string
    onClick(event: MouseEvent): void
    onMouseEnter(event: MouseEvent): void
    onMouseLeave(event: MouseEvent): void
}

export interface IEmbedConf {
    key: string
    isEmbedElem($elem: DomElement): boolean
    getDataFromElem($elem: DomElement): any
    createEmbedInstance(data: any): IEmbed
}

export interface IEmbedInstanceList {
    [key: string]: IEmbed
}
