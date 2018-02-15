function findLongestWord(str) {

    console.log(str);

    str = str.split(' ');

    console.log(str);

    var temp = 0;

    for (var i = 0; i < str.length; i++) {
        if (str[i].length > temp) {
            temp = str[i].length;
        }
    }

    return temp;
}

findLongestWord("The quick brown fox jumped over the lazy dog");