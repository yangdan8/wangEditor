/**
 * @description code with AceEditor
 * @author wangfupeng
 */

import BtnMenu from '../menu-constructors/BtnMenu'
import $ from '../../utils/dom-core'
import Editor from '../../editor/index'
import { MenuActive } from '../menu-constructors/Menu'
import createEmbedConf from './embed-conf/index'
import { DEFAULT_LANG } from './embed-conf/const'

class Code2 extends BtnMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            `<div class="w-e-menu" data-title="代码2">
                <i class="w-e-icon-terminal"></i>
            </div>`
        )
        super($elem, editor)

        // 注册 embed card
        const conf = createEmbedConf()
        editor.embed.registerEmbed(conf)
    }
    /**
     * 点击事件
     */
    public clickHandler(): void {
        this.editor.cmd.insertEmbed('code', {
            code: '',
            lang: DEFAULT_LANG,
        })
    }

    /**
     * 尝试修改菜单激活状态
     */
    public tryChangeActive(): void {}
}

export default Code2
