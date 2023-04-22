# EncryptAny

> encrypt, ANY

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

3. Then you have 2 ways to do that:

##### 3-1. Build a executable file `EncryptAny`

```bash
pnpm build
```

when the build process is done, double click on it to run the script.

##### 3-2. Run `NodeJs` script directly

```bash
node index.js
```

4. Set a password.

5. Your files will be encrypted into a file named `god-words`.

6. Done.

### How to decrypt

1. Install packages.

```bash
pnpm install
```

2. Put `god-words` file into the same folder.

3. Then ou have 2 ways to do that:

##### 3-1. Build a executable file `EncryptAnyBack`

```bash
pnpm build-back
```

when the build process is done, double click on it to run the script.

##### 3-2. Run `NodeJs` script directly

```bash
node back.js
```

4. Input the password you set before.

5. All your encrypted files will be regenerated into `result` folder with a zip file named `result.zip` also.

6. Done.
