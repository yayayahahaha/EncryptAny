# EncryptAny

> encrypt, ANY

#### The executable file is coming soon.

> No more build, no more install, capable and spreadable.

### Environment

| App    | Version |
| ------ | ------- |
| NodeJs | 18^     |
| Pnpm   | 8^      |

### How to encrypt

1. Install packages.

```bash
pnpm install
```

2. Put all files you want to encrypt into `original-files` folder.

3. Run encrypt script and set a password.

```bash
node index.js
```

4. Your files will be encrypted into a file named `god-words`.

### How to decrypt

1. Install packages.

```bash
pnpm install
```

2. Run decrypt script and input the password you set before.

```bash
node back.js
```

3. All your encrypted files will be regenerated into `encrypted-result/result` folder.
