# 后端 API 接口说明文档 (RESTful)

*注：以下接口为前端目前 Mock 数据所对应的标准后端接口契约，后端开发可直接参考此结构设计 Controller 和 DTO。*

## 1. 认证与用户模块 (Auth & User)

### 1.1 用户登录
* **POST** `/api/v1/auth/login`
* **Request Body**: `{ "account": "手机号/邮箱", "password": "密码" }`
* **Response**: `{ "code": 200, "data": { "token": "jwt-token", "user": { "id": 1, "name": "xxx", "avatar": "url" } } }`

### 1.2 用户注册
* **POST** `/api/v1/auth/register`
* **Request Body**: `{ "regType": "phone|email", "account": "...", "password": "..." }`
* **Response**: `{ "code": 200, "message": "注册成功" }`

### 1.3 获取/修改个人资料
* **GET** `/api/v1/user/profile`
* **PUT** `/api/v1/user/profile`
* **Request Body (PUT)**: `{ "name": "新昵称", "avatar": "头像URL" }`

## 2. 设备租赁模块 (Equipment)

### 2.1 获取设备列表
* **GET** `/api/v1/equipments`
* **Query Params**: `category` (分类), `keyword` (搜索词), `page`, `size`
* **Response**: `{ "list": [{ "id": "1", "name": "Sony A7M4", "dailyRent": 150, "image": "..." }] }`

### 2.2 获取设备详情与评价
* **GET** `/api/v1/equipments/{id}`
* **Response**: 包含设备基础信息、详情图文数组、以及 `reviews` (评价列表)。

### 2.3 获取设备档期日历 (防超卖核心)
* **GET** `/api/v1/equipments/{id}/schedule`
* **Query Params**: `yearMonth` (如 2026-04)
* **Response**: 返回该月每一天的可用库存状态，前端据此禁用不可选日期。

## 3. 订单交易模块 (Order)

### 3.1 创建租赁订单
* **POST** `/api/v1/orders`
* **Request Body**: `{ "equipmentId": "1", "startDate": "2026-04-01", "endDate": "2026-04-03", "addressId": "123" }`
* **Response**: `{ "code": 200, "data": { "orderId": "ORD123456", "totalAmount": 450 } }`

### 3.2 模拟支付
* **POST** `/api/v1/orders/{id}/pay`
* **Response**: `{ "code": 200, "message": "支付成功", "status": "待发货" }`

### 3.3 获取我的订单列表
* **GET** `/api/v1/orders`
* **Query Params**: `status` (待支付/待发货/租借中/已完成)
* **Response**: 订单列表数组。

### 3.4 提交设备评价
* **POST** `/api/v1/orders/{id}/review`
* **Request Body**: `{ "rating": 5, "content": "设备很好用！" }`

## 4. 社区互动模块 (Community)

### 4.1 获取社区动态列表
* **GET** `/api/v1/community/posts`
* **Query Params**: `page`, `size`
* **Response**: `{ "list": [{ "id": "1", "author": {...}, "content": "...", "images": [...], "equipmentRef": {...}, "likes": 120, "comments": 45 }] }`

### 4.2 动态点赞/取消点赞
* **POST** `/api/v1/community/posts/{id}/like`

### 4.3 发表评论
* **POST** `/api/v1/community/posts/{id}/comments`
* **Request Body**: `{ "content": "拍得太好看了！" }`
