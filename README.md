Services info


----

User-Service: 

PORT= 3001

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/user_service?schema=public"


------


product-service: 

DATABASE_URL="postgresql://postgres:password@localhost:5433/productdb"

PORT=3002

----


basket-service:

DATABASE_URL="postgresql://postgres:password@localhost:5434/basketdb?schema=public"

PORT=3003

------

Email-service:

DATABASE_URL="postgresql://postgres:password@localhost:5435/emaildb?schema=public"

PORT=3004

-----

Order-service:

DATABASE_URL="postgresql://postgres:password@localhost:5436/orderdb"

PORT=3005

-----



