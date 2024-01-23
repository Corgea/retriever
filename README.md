<p align="center">
  <img src="https://raw.githubusercontent.com/Corgea/retriever/main/img/logo.png">
</p>

# Retreiver
Secure secret sharing through the browser using web crypto. No server required!

[Try it here](https://retriever.corgea.io)


[Why did we build this?](https://retriever.corgea.io/why.html)

## Features
* 100% client-side
* Uses standard browser web crypto APIs
* Links are secure and won't decrypt the secret
* Your secrets and the private keys that encrypt them are never sent to a server by Retriever

## How it works
![How retriever works](https://github.com/Corgea/retriever/blob/main/img/encryption_flow.png?raw=true)

## Roadmap
* Support for larger secrets
* File sharing
* Bi-directional sharing

## Analytics disclosure
Retreiver does use Mixpanel to help the Corgea team know if it's getting traffic. We do not transmit any of your secrets and private keys to Mixpanel. 
It is only used if you use https://retriever.corgea.io/. If you run this locally it will not send any analytics to Mixpanel and you can choose to remove it. 