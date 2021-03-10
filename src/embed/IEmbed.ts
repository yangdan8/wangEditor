/**
 * @description embed class 接口
 * @author wangfupeng
 */

import { IAttr } from '../lib/simplehtmlparser'
import { DomElement } from '../utils/dom-core'

export interface IEmbed {
    id: string
    embedKey: string
    isBlock: boolean
    data: any
    readonly $container: DomElement // getter
    getRenderHtml(): string
    getResultHtml(): string
    update(data: any): void
    remove(): void
    onClick(event: MouseEvent): void
    onMouseEnter(event: MouseEvent): void
    onMouseLeave(event: MouseEvent): void
}

export interface IEmbedConf {
    key: string
    isEmbedResultHtml(tag: string, attrs: IAttr[]): boolean
    getDataByResultHtml(resultHtml: string): any
    createEmbedInstance(data: any): IEmbed
}

export interface IEmbedInstanceList {
    [key: string]: IEmbed
}
