import Editor from '../../../editor/index'
import $, { DomElement } from '../../../utils/dom-core'
import { EMPTY_P } from '../../../utils/const'

/**
 * list 内部逻辑
 * @param editor
 */
function bindEvent(editor: Editor) {
    /**
     * 判断传入的单行顶级选区选取是不是序列
     * @param editor 编辑器对象
     */
    function isList($topSelectElem: DomElement) {
        if ($topSelectElem.length) {
            return (
                ($topSelectElem.getNodeName() === 'UL' || $topSelectElem.getNodeName() === 'OL') &&
                $topSelectElem.attr('class') !== 'w-e-todo'
            )
        }

        return false
    }
    /**
     * 判断选中的内容是不是都是序列
     * @param editor 编辑器对象
     */
    function isAllTodo(editor: Editor): boolean | undefined {
        const $topSelectElems = editor.selection.getSelectionRangeTopNodes()
        // 排除为[]的情况
        if ($topSelectElems.length === 0) return

        return $topSelectElems.every($topSelectElem => {
            return isList($topSelectElem)
        })
    }

    function delDown(e: Event) {
        if (isAllTodo(editor)) {
            const selection = editor.selection
            const $topSelectElem = selection.getSelectionRangeTopNodes()[0]
            const selectionNode = window.getSelection()?.anchorNode as Node
            const pos = selection.getCursorPos()
            const prevNode = selectionNode.previousSibling

            // 获取当前标签元素
            const $selectionElem = editor.selection.getSelectionContainerElem() as DomElement
            const $nextNode = $selectionElem.getNextSibling()
            // 光标在最前面的情况
            if (prevNode?.nodeName === 'LI' && pos === 0) {
                e.preventDefault()
                const $preUl = $(`<ul></ul>`)
                const $nextUl = $(`<ul></ul>`)
                const $newP = $(EMPTY_P)
                // 判断是否包裹在两个li标签之间
                if ($nextNode.length > 0 && $nextNode?.getNodeName() === 'LI') {
                    let currInde = -1 // 记录当前节点在ul中的位置
                    $topSelectElem?.childNodes()?.forEach((elem, index: any) => {
                        const $elem = $(elem)
                        if ($elem.equal($selectionElem)) {
                            currInde = index
                        }
                        if (currInde === -1) {
                            $preUl.append($elem.clone(true))
                        } else if (index > currInde) {
                            $nextUl.append($elem.clone(true))
                        }
                    })
                    $preUl.insertAfter($topSelectElem)
                    $newP.insertAfter($preUl)
                    $nextUl.insertAfter($newP)
                    $topSelectElem.remove()
                    selection.moveCursor($newP.getNode(), 0)
                } else {
                    $newP.insertAfter($topSelectElem)
                    $selectionElem.remove()
                    selection.moveCursor($newP.getNode(), 0)
                }
            }
        }
    }

    editor.txt.eventHooks.deleteDownEvents.push(delDown)
}

export default bindEvent
