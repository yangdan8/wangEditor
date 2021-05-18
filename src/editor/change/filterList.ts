export const filterList: Set<string> = new Set()

export const setFilterList = (list: string[]) => {
    list.forEach(v => {
        filterList.add(v)
    })
}
