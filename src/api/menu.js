import request from '@/utils/request'
const off_line = JSON.parse(import.meta.env.VITE_OFF_LINE || false)

// 获取路由
export const getRouters = () => {
  if (off_line) {
    return Promise.resolve({
      "msg": "操作成功",
      "code": 200,
      "data": [
        {
          "name": "Active-detection",
          "path": "/",
          "hidden": false,
          "redirect": "noRedirect",
          "component": "Layout",
          "alwaysShow": false,
          "meta": {
            "title": "主动水印",
            "icon": "documentation",
            "noCache": false,
            "link": null
          },
          "children": [
            {
              "name": "anti-screen-image-watermark",
              "path": "anti-screen-image-watermark",
              "hidden": false,
              "meta": {
                "title": "抗屏摄图像水印",
                "noCache": false,
                // "icon": "documentation",
                "link": null
              },
              "children": [
                {
                  "name": "watermark-embedding3",
                  "path": "watermark-embedding3",
                  "hidden": false,
                  "component": "watermark/kpstxsy/list",
                  "meta": {
                    "title": "图像水印嵌入",
                    "noCache": false,
                    "link": null
                  }
                },
                {
                  "name": "watermark-extraction3",
                  "path": "watermark-extraction3",
                  "hidden": false,
                  "component": "watermark/kpstxsy/resouce",
                  "meta": {
                    "title": "图像水印提取",
                    "noCache": false,
                    "link": null
                  }
                }
              ]
            },
            {
              "name": "robust-image-watermark",
              "path": "robust-image-watermark",
              "hidden": true,
              "meta": {
                "title": "鲁棒图像水印",
                // "icon": "documentation",
                "noCache": false,
                "link": null
              },
              "children": [
                {
                  "name": "watermark-embedding1",
                  "path": "watermark-embedding1",
                  "hidden": false,
                  "component": "watermark/lbtxsy/list",
                  "meta": {
                    "title": "鲁棒图像水印嵌入",
                    "noCache": false,
                    "link": null
                  }
                },
                {
                  "name": "watermark-extraction1",
                  "path": "watermark-extraction1",
                  "hidden": false,
                  "component": "watermark/lbtxsy/resouce",
                  "meta": {
                    "title": "鲁棒图像水印提取",
                    "noCache": false,
                    "link": null
                  }
                }
              ]
            },
            {
              "name": "robust-video-watermark",
              "path": "robust-video-watermark",
              "hidden": false,
              "meta": {
                "title": "鲁棒视频水印",
                // "icon": "documentation",
                "noCache": false,
                "link": null
              },
              "children": [
                {
                  "name": "watermark-embedding2",
                  "path": "watermark-embedding2",
                  "hidden": false,
                  "component": "watermark/lbspsy/list",
                  "meta": {
                    "title": "视频水印嵌入",
                    "noCache": false,
                    "link": null
                  }
                },
                {
                  "name": "watermark-extraction2",
                  "path": "watermark-extraction2",
                  "hidden": false,
                  "component": "watermark/lbspsy/resouce",
                  "meta": {
                    "title": "视频水印提取",
                    "noCache": false,
                    "link": null
                  }
                }
              ]
            },
            
          ]
        },

        {
          "name": "Passive-detection",
          "path": "/passive-detection",
          "hidden": false,
          "redirect": "noRedirect",
          "component": "Layout",
          "alwaysShow": true,
          "meta": {
            "title": "检测类型",
            "icon": "documentation",
            "noCache": false,
            "link": null
          },
          "children": [
            {
              "name": "Forge-image",
              "path": "forge-image",
              "hidden": false,
              "component": "forge/image",
              "meta": {
                "title": "图像篡改检测",
                "noCache": false,
                "link": null
              }
            },
            {
              "name": "Forge-text_image",
              "path": "forge-text_image",
              "hidden": false,
              "component": "forge/text_image",
              "meta": {
                "title": "文档图像检测",
                "noCache": false,
                "link": null
              }
            },
            {
              "name": "AI-text",
              "path": "AI-text",
              "hidden": true,
              "component": "forge/AI-text",
              "meta": {
                "title": "AIGC文本检测",
                "noCache": false,
                "link": null
              }
            },
            {
              "name": "AIGC-image",
              "path": "AIGC-image",
              "hidden": true,
              "component": "forge/AIGC-image",
              "meta": {
                "title": "AIGC图像检测",
                "noCache": false,
                "link": null
              }
            },
            {
              "name": "Forge-video",
              "path": "forge-video",
              "hidden": false,
              "component": "forge/video",
              "meta": {
                "title": "深伪视频检测",
                "noCache": false,
                "link": null
              }
            },
            {
              "name": "Forge-audio",
              "path": "forge-audio",
              "hidden": true,
              "component": "forge/audio",
              "meta": {
                "title": "深伪音频检测",
                "noCache": false,
                "link": null
              }
            },
            {
              "name": "Forge-text",
              "path": "forge-text",
              "hidden": false,
              "component": "forge/text",
              "meta": {
                //"title": "虚假新闻检测",
                "title": "图文新闻伪造检测系统",
                "noCache": false,
                "link": null
              }
            },
            {
              "name": "Face-detect",
              "path": "face-detect",
              "hidden": true,
              "component": "forge/face_detect",
              "meta": {
                "title": "人脸识别检测",
                "noCache": false,
                "link": null
              }
            }
          ]
        },

        {
          "name": "Image-inpainting",
          "path": "/image-inpainting",
          "hidden": false,
          "redirect": "noRedirect",
          "component": "Layout",
          "alwaysShow": true,
          "meta": {
            "title": "图像修复与修复检测",
            "icon": "documentation",
            "noCache": false,
            "link": null
          },
          "children": [
            {
              "name": "anti-detection-inpainting",
              "path": "anti-detection-inpainting",
              "hidden": false,
              "component": "forge/inpainting",
              "meta": {
                "title": "抗检测的图像修复方法",
                "noCache": false,
                "link": null
              },
            },
            {
              "name": "inpainting-detection",
              "path": "inpainting-detection",
              "hidden": false,
              "component": "forge/inpainting_detection",
              "meta": {
                "title": "针对图像修复篡改的检测方法",
                "noCache": false,
                "link": null
              },
            }
          ]
        }
      ]
    })
  } else {
    return request({
      url: '/getRouters',
      method: 'get'
    })
  }
}
