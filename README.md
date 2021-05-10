# Yallo Market API Server

# [1] 개발 프로세스 정립

- 개발 프로세스 정립

    ### [1-1] 이슈/버전 관리

    [Git Hub Banching Model](https://www.notion.so/62008b3ee46747a895f80f0c0a08a2d3)

    ### [1-2] 의존성 관리 도구

    [외부라이브러리 (built-in 라이브러리 제외) 관리 도구](https://www.notion.so/ca3c7713223c4bd7aa06202707f2869e)

    ### [1-3] 개발 스택 정립

    [프로젝트 별 개발 스택](https://www.notion.so/4489b181ca6a47a1998f54dff3be4b0d)

# [2] API 설계 원칙

- API 설계 원칙

    ### [2-1] 직렬화(serialization) 포맷

    서비스내에서 발생하는 어떠한 데이터 구조를 송/수신/저장에 적합한 포맷으로  변환하는 과정
    적합한 포맷은 프로토콜/언어/플랫폼에 독립적이며 보편적이고 표준화된 포맷 (JSON, XML ... )

    node.js 기반의 웹 서버는 .json 을 default 로 사용하므로 JSON Format 을 직렬화 포맷으로 사용한다.
    JSON 파일의 value type 을 실제 연산 타입에 적용 할 수 있도록 사용하여 의도를 분명히 한다. 

    [JSON (key-value) 사용](https://www.notion.so/63e6781b3bf44f72b2b25f15d61bd4bb)

    ---

    ### [2-2] REST API

    Representational State Transfer, 서버가 보유한 '자원'을 이름으로 구별하여 해당 자원의 '상태'를 주고 받는 모든 것.
    1. HTTP URI 를 통해 자원(resource)을 명시 
    2. HTTP Method 를 통해 자원에 대한 CRUD Operation 을 명시  

    - Create (POST) 
    - Read (GET)
    - Update (UPDATE)
    - Delete (DELETE)
    - HEAD (HEAD)**

    1. **HTTP URI Resource 표현에 대한 명세**
        1. 동사 → 명사로, 대문자 → 소문자로
        2. 스토어/컬렉션(집합)명 은 복수명사
    2. **HTTP Method 표현에 대한 명세**
        1. URI (Route) 에 Method 를 명시해서는 안된다.
        2. 행위에 대한 동사표현이 들어가서는 안된다.
        3. 경로 부분의 동적인 부분은 유일한 값으로 반드시 대체한다.
    3. **기타 설계 규칙**
        1. 슬래시 구분자('/') 는 계층 관계에만 사용한다.
        2. uri 의 마지막에는 슬래시 구분자를 사용하지 않는다.
        3. 단어 집합은 하이픈('-') 을 사용한다.
        4. 파일 확장자를 uri 에 포함하지 않는다.

    [CRUD Operation](https://www.notion.so/f7ab1c8127a249b59ff2907b64a4e3a2)

    ---


# [3] API 스펙 설계

- API 스펙 설계

    ### [3-1] Directory Tree (yallo-market-api-server)

    ```tsx
    .
    ├── common
    │   ├── constants
    │   ├── decorator
    │   ├── exceptions
    │   ├── guards
    │   ├── interfaces
    │   ├── middlewares
    │   ├── pipes
    │   └── serializers
    ├── config
    │   ├── app
    │   ├── cache
    │   └── database
    │       ├── mongo
    │       ├── mysql     // AWS RDS config, MySQL 5.7
    │       └── mysql-dev // GCP Cloud Storage SQL config, MySQL 5.7
    ├── database
    │   └── seeders
    ├── jobs
    ├── mails
    ├── models
    │   ├── auth
    │   │   ├── constants
    │   │   ├── dto
    │   │   ├── entities
    │   │   └── interfaces
    │   └── test
    └── providers
        ├── cache
        └── database
            ├── mongo
            ├── mysql
            └── mysql-dev
    ```
#### /common
| 디렉토리명 | 내용 |
|---|:---:|
| `constants` | 공용 사용 **상수값** 정의 |
| `decorator` | meta data 를 인자로 하고 함수를 반환하는 nest custom decorator 정의 |
| `exceptions` | 서비스 내 특정 클래스에서 발생하는 예외에 대한 nest custom exceptions 정의 (내장 예외 레이어 제외) |
| `guards` | 각 middleware 이후, interceptor or pipe 이전 실행되며 런타임안에서 요청의 적정 조건 만족여부 확인 후 controller 처리 할지를 판단하는 custom guard 정의  |
| `interfaces` | /common 디렉토리 내에서 사용되는 interfaces 정의, /src 제외 타 디렉토리 내에서 사용되는 interfaces 정의  |
| `middlewares` | nest() 메소드를 통해 HTTP request, response 에 접근 할 수 있는 custom middleware 정의  |
| `pipes` | Nest method 가 호출되기 직전에 삽입되며 예외 영역 내에서 실행되는 custom pipe 정의  |
| `serializers` | 네트워크 응답과정에서 개채 반환 직전 데이터를 변환/삭제 하는 규칙을 제공하는 custom serializer 정의  |

#### /config
| 디렉토리명 | 내용 |
|---|:---:|
| `app` | nest 프로젝트 내에서 사용되는 공용, 전역 환경 변수 정의 |
| `cache` | HTTP 요청 처리간에 발생하는 cache 처리 관련 환경 변수 정의 |
| `database` | 데이터베이스 connection 과 관련된 환경 변수 정의 |

#### /providers
| 디렉토리명 | 내용 |
|---|:---:|
| `cache` | 임시 데이터 저장소 cache connection provider 를 정의 |
| `database` | typeorm module connection provider 를 정의 (Database 연결 공급자) |

#### /jobs
(https://docs.nestjs.com/techniques/queues)
| 디렉토리명 | 내용 |
|---|:---:|
| `consumers` | @nestjs/bull 라이브러리를 통해 생성된는 nest queue 대기 작업 처리 방식 정의 |
| `producers` | @nestjs/bull 라이브러리를 통해 생성된는 nest queue 대기 작업 생성 방식 정의) |


   ### [3-2] API Endpoints (/src/models/...controller)

   [/auth](https://www.notion.so/3e63a5deaf534200ae892d5c9f108a72)

   [/owner](https://www.notion.so/c318df53a76d427c8bb07aebb75d22ea)

   [/market](https://www.notion.so/b514292f46374e579623da8e8f09b2ae)

   [/order-list](https://www.notion.so/b3772258922248458653e5736490bece)

   [/my-store](https://www.notion.so/cc2f6ab7f3994308b247655c48009fee)

# [4] API Entity 설계

- API Entity 설계

    Yallo Market API server 의 ORM(Object-relational mapping) 은 **TypeORM** 을 사용한다.
    JavaScript, TypeScript 의 Class 를 Table 로 맵핑

    ### [4-1] Entity 스펙 설계

    - **각 Entity 는 기본열을 가진다.**

    ```tsx
    @Entity()
    export class User {
        @PrimaryGeneratedColumn()
        id: number;

        @Column()
        firstName: string;
    }
    ```

    - **Entity 의 각 Column 은 타입과 크기를 가진다.**

    ```tsx
    @Column("varchar", { length: 200 })

    @Column({ type: "int", width: 200 })
    ```

    - **Entity 의 각 Column 은 열 옵션을 가진다.**
    ([https://typeorm.io/#/entities](https://typeorm.io/#/entities) 참고 - DB type == mysql,maria)

    ```tsx
    @Column({
        type: "varchar",
        length: 150,
        unique: true,
        // ...
    })
    name: string;
    ```

    - **Entity Method 는 QueryBuilder 를 사용한다.**
    ([https://typeorm.io/#/select-query-builder](https://typeorm.io/#/select-query-builder) 참고)

    ```tsx
    const firstUser = await connection
        .getRepository(User)
        .createQueryBuilder("user")
        .where("user.id = :id", { id: 1 })
    		// ...
        .getOne();
    ```

    ### [4-2] Entity 컬럼 정의

    [user](https://www.notion.so/43071e4a5cbf4107ad862af799076ff3)

    [mystore](https://www.notion.so/1429675191ce4564abcd3c272fa8499a)

    → 즐겨찾기 한 가게 목록

    [orderlist](https://www.notion.so/4792944ea7bc42beb11dd5726f468562)

    [store](https://www.notion.so/00d612af9da3451d839984de788471af)

    [owner](https://www.notion.so/83ed0792054f4eb79d3e40bc3b54afdb)

    → 개별 사업체

    [product](https://www.notion.so/3b555ebf8cd542089adaacc47f0003e4)
