let info = [...info1.result.XXBTZGBP]
let index = 0

function merge(array) {
    for (i = 0; i < info.length; i++) {
        let item = info[i]
        if (item[0] === info2.result.XXBTZGBP[0][0]) {
            index = i
            info = info.slice(0, i - 1)
            info.push(...array)
            break
        }
    }
    return info
}