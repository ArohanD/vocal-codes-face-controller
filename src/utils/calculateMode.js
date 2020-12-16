const calculateMode = (nums) => {
    console.log(nums)
    if(!nums || nums.length === 0) return 0;

    const dictionary = {}
    nums.forEach(num => {
        if(dictionary[num]){
            dictionary[num]++;
        } else {
            dictionary[num] = 1
        }
    });
    console.log(dictionary)
    return +Object.keys(dictionary)
            .map(key => [key, dictionary[key]])
            .sort((a, b) => b[1] - a[1])[0][0]
}

const quickTest = () => {
    arr1 = [1, 2, 3, 4, 5, 6, ,5 ,6 ,6, 7, 7, 8, 5, 6, 4]
    arr2 = [2,3,2,2,2,2,2,,2,2,2,2,3]
    arr3 = []
    arr4 = [1]
    arr5 = [6,6,6,6,6,7,7,7,7,7]

    console.log(calculateMode(arr5))
}

// quickTest()

export default calculateMode;