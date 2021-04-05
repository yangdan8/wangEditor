/**
 * @description 插入、上传图片
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import $ from '../../utils/dom-core'
import createPanelConf from './create-panel-conf'
import { MenuActive } from '../menu-constructors/Menu'
import createEmbedConf from './embed-conf'
import Panel from '../menu-constructors/Panel'
import PanelMenu from '../menu-constructors/PanelMenu'

class video2 extends PanelMenu implements MenuActive {
    constructor(editor: Editor) {
        let $elem = $(
            '<div class="w-e-menu" data-title="图片"><i class="w-e-icon-image"></i></div>'
        )
        super($elem, editor)
        const conf = createEmbedConf()
        editor.embed.registerEmbed(conf)
    }

    /**
     * 菜单点击事件
     */
    public clickHandler(): void {
        // this.editor.cmd.insertEmbed('video', {})
        this.createPanel()
    }

    private createPanel() {
        const conf = createPanelConf()
        const panel = new Panel(this, conf)
        panel.create()
    }


    /**
     * 尝试修改菜单 active 状态
     */
    public tryChangeActive() { }
}

export default video2
