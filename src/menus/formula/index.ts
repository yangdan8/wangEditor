/**
 * @description formula 菜单
 * @author wangfupeng
 */

import PanelMenu from '../menu-constructors/PanelMenu'
import Editor from '../../editor/index'
import $ from '../../utils/dom-core'
import createPanelConf from './create-panel-conf'
import isActive from './is-active'
import Panel from '../menu-constructors/Panel'
import { MenuActive } from '../menu-constructors/Menu'
import createEmbedConf from './embed-conf/index'

class Formula extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        const $elem = $(
            '<div class="w-e-menu" data-title="公式"><i class="w-e-icon-link"></i></div>'
        )
        super($elem, editor)

        // 注册 embed card
        const conf = createEmbedConf()
        editor.embed.registerEmbed(conf)
    }

    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        const conf = createPanelConf(this.editor)
        const panel = new Panel(this, conf)
        panel.create()
    }

    /**
     * 尝试修改菜单 active 状态
     */
    public tryChangeActive() {
        const editor = this.editor
        if (isActive(editor)) {
            this.active()
        } else {
            this.unActive()
        }
    }
}

export default Formula
