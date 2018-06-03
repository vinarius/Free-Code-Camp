function palindrome(str) {

    var temp = str.toLowerCase().replace(/[^a-z0-9]/g, '');

    console.log(temp);

    var reversed = temp.split('').reverse().join('');

    console.log(reversed);

    if (temp == reversed) {
        return true;
    } else {
        return false;
    }
}

palindrome("_eye");