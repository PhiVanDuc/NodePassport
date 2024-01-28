# Xác thực người dùng

- Xác minh thông tin người dùng (email, password) có hợp lệ hay không?
- Hợp lệ: thì nêu thông tin vào session hoặc token (jwt)
- Không hợp lệ: Thông báo lỗi

- Mật khẩu: Mã hóa 1 chiều
- Cách cũ: md5(), sha1() --> Không an toàn
SELECT * FROM users WHERE email='phivanduc325@gmail.com' AND password=md5('123456')

- Hiện tại: hash bcrypt --> An toàn

* Truy vấn theo email để trả về password hash trong db
* So sánh plain password với passowrd hash lấy từ database bằng thuật toán so sánh
    -> Nếu khớp => Lưu vào session hoặc database
    -> Nếu không khớp => Trả về thông báo lỗi



# Tình huống thực tế

- Mỗi một lập trình viên sẽ có cách xác thực khác nhau
- Trong một ứng dụng sẽ có nhiều cách xác thực
    + email, password
    + phone number, password
    + google
    + facebook
    + github
    --> Đơn giản hóa việc xác thực qua các mạng xã hội
    --> Đồng nhất các cách xác thực:
        + Cách lưu session
        + Cách lấy thông tin user
        + Các hiển thị lời chào
        + Cách đăng xuất
    --> Thư viện hỗ trợ xác thực cho nodejs: passport.js


# Đăng nhập thông qua mạng xã hội

- Sử dụng thông tin tài khoản mạng xã hội để lấy user --> Insert database --> Thực hiện login trên thông tin đó

# 2 bước triển khai

- Tạo 1 link chuyển hướng tới các mạng xã hội để đăng nhập
- Xử lý lấy dữ liệu và insert dữ liệu vào db sau khi đăng nhập xong trên các mạng xh (Khi đăng nhập xong sẽ chuyển hướng về callback url)


# DB

Table providers
- id
- name

Table users
- id
- provider_id
- name
- email
- password
- status






'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const providers = [
      {
        name: 'email',
      }
    ];

    await queryInterface.bulkInsert('providers', providers);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('providers')
  }
};




'use strict';

/** @type {import('sequelize-cli').Migration} */
const bcrypt = require('bcrypt');
const { Provider } = require('../models/index');
module.exports = {
  async up (queryInterface, Sequelize) {
    const id = Provider.max('id');

    const salt = bcrypt.genSaltSync(10);
    const users = [
      {
        provider_id: +id,
        name: 'Phí Văn Đức',
        email: 'phid808@gmail.com',
        password: bcrypt.hashSync('123456', salt),
        status: true,
      }
    ];

    await queryInterface.bulkInsert('users', users);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users')
  }
};
