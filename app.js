const {createApp, ref, computed} = Vue

const urlcopy = {
    props: ['url'],
    data() {
        return {
            copyText: 'Copy'
        }
    },
    methods: {
        copyToClipboard() {
            navigator.clipboard.writeText(this.url)
            this.copyText = 'Copied!'
        }
    },
    template: `
        <div class="input-group mb-3">
            <input type="text" class="form-control" v-model="url" disabled>
            <button class="btn btn-primary btn-copy" type="button" @click.native="copyToClipboard">
                {{ copyText }}
            </button>
        </div>`
}

createApp({
    components: {
        urlcopy
    },
    setup() {
        const url = ref('')
        const inputData = ref('')
        const encryptedUrl = ref('')
        const newSecret = ref(false)
        const decryptSecret = ref(false)

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

        return {
            encrypt,
            encryptedUrl,
            inputData,
            newSecret,
            decryptSecret,
            url
        }
    }
}).mount('#app')