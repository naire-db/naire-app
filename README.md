## Getting Started

```
$ git clone git@github.com:naire-db/naire-app.git
$ cd naire-app
$ yarn
```

## Contributing

```
$ git checkout main
$ git pull
$ git checkout -b dev-[feature or patch name]  # 切换到新分支 
$ webstorm .  # 在新的分支上修改
$ git add [files ..]
$ git commit -m "[feature]: [changes]"
$ git pull origin main  # 合并上游更改
$ git push -u origin dev-[feature or patch name]
$ # 开启 Pull Request
```

### WebStorm Code Style

从 [docs/Default.xml](docs/Default.xml) 导入

## CRA

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
