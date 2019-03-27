function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
    let newArr = arr.slice()
    for (let i = 0; i < newArr.length; i++) {
        let j = getRandomInt(0, i)
        let tmp = newArr[i]
        newArr[i] = newArr[j]
        newArr[j] = tmp
    }
    return newArr
}

export function debounce(func, delay) {
    let timer
    return function(...args) {
        if (timer)
            clearTimeout(timer)
        timer = setTimeout(() => {
            func.apply(this, args)
        }, delay);
    }
}