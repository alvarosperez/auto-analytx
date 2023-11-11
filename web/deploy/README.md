# Instructions to test on local before deploying

## script
You may run the deploy_local.sh script from the deploy folder and it will deploy both dockers locally

## WEB (LOCAL)
**Run from root of proyect**
```
docker build . -f ./deploy/web.dockerfile -t tfm-web
docker run -d -p 80:80 --name tfm-web tfm-web
```

Test on http://localhost
