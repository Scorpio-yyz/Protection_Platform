import request from '@/utils/request'
const off_line = JSON.parse(import.meta.env.VITE_OFF_LINE || false)


// 登录方法
export function login(username, password, code, uuid) {
  const data = {
    username,
    password,
    code,
    uuid
  }
  if (off_line) {
    return Promise.resolve({
      "msg": "操作成功",
      "code": 200,
      "token": "eyJhbGciOiJIUzUxMiJ9.eyJsb2dpbl91c2VyX2tleSI6IjFkMmJlNjFiLTljYmItNGJkNi1hMDg3LTM2Y2EzYjVhN2VjMCJ9.RJ2fblm22x3qpCRlqCp56lfe84g5jlZEnoWulWN91vEDvdmgomX0aYW85VJj0T2tDHIqq2xnrUgDbWbD0C8opg"
    })
  } else {
    return request({
      url: '/login',
      headers: {
        isToken: false
      },
      method: 'post',
      data: data
    })
  }
}

// 注册方法
export function register(data) {
  return request({
    url: '/register',
    headers: {
      isToken: false
    },
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getInfo() {
  if (off_line) {
    return Promise.resolve({
      "msg": "操作成功",
      "code": 200,
      "permissions": [
        "*:*:*"
      ],
      "roles": [
        "admin"
      ],
      "user": {
        "createBy": "admin",
        "createTime": "2023-07-19 16:38:35",
        "updateBy": null,
        "updateTime": null,
        "remark": "管理员",
        "params": {
          "@type": "java.util.HashMap"
        },
        "userId": 1,
        "deptId": 103,
        "userName": "admin",
        "nickName": "管理员",
        "email": "1156676785@qq.com",
        "phonenumber": "15888888888",
        "sex": "0",
        "avatar": "/profile/avatar/2023/08/13/blob_20230813160903A003.png",
        "password": "$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2",
        "status": "0",
        "delFlag": "0",
        "loginIp": "36.148.248.31",
        "loginDate": "2023-09-29T15:38:09.000+08:00",
        "dept": {
          "createBy": null,
          "createTime": null,
          "updateBy": null,
          "updateTime": null,
          "remark": null,
          "params": {
            "@type": "java.util.HashMap"
          },
          "deptId": 103,
          "parentId": null,
          "ancestors": null,
          "deptName": null,
          "orderNum": null,
          "leader": null,
          "phone": null,
          "email": null,
          "status": null,
          "delFlag": null,
          "parentName": null,
          "children": []
        },
        "roles": [
          {
            "createBy": null,
            "createTime": null,
            "updateBy": null,
            "updateTime": null,
            "remark": null,
            "params": {
              "@type": "java.util.HashMap"
            },
            "roleId": 1,
            "roleName": "超级管理员",
            "roleKey": "admin",
            "roleSort": 1,
            "dataScope": "1",
            "menuCheckStrictly": false,
            "deptCheckStrictly": false,
            "status": "0",
            "delFlag": null,
            "flag": false,
            "menuIds": null,
            "deptIds": null,
            "permissions": null,
            "admin": true
          }
        ],
        "roleIds": null,
        "postIds": null,
        "roleId": null,
        "admin": true
      }
    })
  }else{
    return request({
      url: '/getInfo',
      method: 'get'
    })
  }
}

// 退出方法
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 获取验证码
export function getCodeImg() {
  if (off_line) {
    return Promise.resolve({
      "msg": "操作成功",
      "img": "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",
      "code": 200,
      "captchaEnabled": true,
      "uuid": "d91ccd3d382e4c51873047616cd25fea"
    })
  }else{
    return request({
      url: '/captchaImage',
      headers: {
        isToken: false
      },
      method: 'get',
      timeout: 20000
    })
  }
}