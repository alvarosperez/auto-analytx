# Instructions to test on local before deploying

## script
You may run the deploy_local.sh script from the deploy folder and it will deploy both dockers locally

## api (LOCAL)
**Run from root of proyect**
```
docker build . -f ./deploy/api.dockerfile -t tfm-api
docker run -d -p 8088:80 --name tfm-api tfm-api
```

Test on http://localhost
