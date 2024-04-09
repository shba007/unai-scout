function distribue(oldArr: any[], coloumNum: number) {
	const arr = Array(coloumNum).fill(null).map<any[]>(() => [])

	for (let [index, video] of oldArr.entries()) {
		arr[index % coloumNum].push(video)
	}

	return arr
}

export { distribue }