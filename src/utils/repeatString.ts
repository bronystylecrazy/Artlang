const repeatStr = (count, char) => {
    return [...Array(count)].reduce(c => c + char,'')
}

export default repeatStr;