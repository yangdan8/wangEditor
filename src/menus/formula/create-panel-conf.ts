/**
 * @description link 菜单 panel tab 配置
 * @author wangfupeng
 */

import Editor from '../../editor/index'
import { PanelConf } from '../menu-constructors/Panel'
import { getRandom } from '../../utils/util'
import $ from '../../utils/dom-core'

export default function (editor: Editor): PanelConf {
    // panel 中需要用到的id
    const inputFormulaId = getRandom('input-formula')
    const btnOkId = getRandom('btn-ok')

    // 插入
    function insertFormula(val: string) {
        editor.cmd.insertEmbed('formula', val)
    }

    const conf = {
        width: 300,
        height: 0,

        // panel 中可包含多个 tab
        tabs: [
            {
                // tab 的标题
                title: editor.i18next.t('menus.panelMenus.link.公式'),
                // 模板
                tpl: `<div>
                        <textarea id="${inputFormulaId}" style="width: 100%" rows="3"></textarea>
                        <div class="w-e-button-container">
                            <button type="button" id="${btnOkId}" class="right">
                                ${editor.i18next.t('插入')}
                            </button>
                        </div>
                    </div>`,
                // 事件绑定
                events: [
                    {
                        selector: '#' + btnOkId,
                        type: 'click',
                        fn: () => {
                            const $input = $('#' + inputFormulaId)
                            let val = $input.val().trim()
                            if (!val) return

                            insertFormula(val)

                            // 返回 true，表示该事件执行完之后，panel 要关闭。否则 panel 不会关闭
                            return true
                        },
                    },
                ],
            }, // tab end
        ], // tabs end
    }

    return conf
}
