const {createApp, ref, computed} = Vue

createApp({
    setup() {
        const url = ref('')
        const inputData = ref('')
        const encryptedUrl = ref('')
        const newSecret = ref(false)
        const decryptSecret = ref(false)
        const copyText = ref('Copy')

        function copyToClipboard() {
            navigator.clipboard.writeText(url.value)
            copyText.value = 'Copied!'
        }

        function encrypt() {
            load_key(location.hash.split('#')[1], 'encrypt').then(function (value) {
                return value
            }).then(function (publicKey) {
                return encryptString(publicKey, inputData.value).then((value) => value)
            }).then(function (encryptedValue) {
                url.value = window.location.href + ';' + encryptedValue
                inputData.value = ""
            })
        }

        function decrypt() {
            let [pubKeySer, encryptedText] = location.hash.replace('#', '').split(';')
            console.log(pubKeySer)
            console.log(encryptedText)
            load_key(window.localStorage.getItem(pubKeySer), 'decrypt').then(function (privKey) {
                return privKey
            }).then(function (privKey) {
                return decryptString(privKey, encryptedText).then((value) => value)
            }).then(function (decryptedValue) {
                inputData.value = decryptedValue
            })
        }

        if (location.hash === '') {
            newSecret.value = true
            generateKeyPair().then(function (value) {
                url.value = location.href + '#' + value
            })
        } else if (location.hash.includes(';')) {
            decryptSecret.value = true
            decrypt()
        }
        /*
        else {
            pub_key_ser = location.hash.split("#")[1]
        }
        */

        return {
            encrypt,
            encryptedUrl,
            inputData,
            newSecret,
            decryptSecret,
            url,
            copyToClipboard,
            copyText
        }
    }
}).mount('#app')