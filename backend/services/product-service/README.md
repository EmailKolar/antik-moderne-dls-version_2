




prereqs.
install rabbitmq

copy .env.example to .env


*to run* 

npm i

*run docker db*

docker compose up -d

*inititalize  prisma*

npx prisma generate
npx prisma migrate dev --name init



*run service*

npm run dev

*open rabbit mq*
localhost:15672