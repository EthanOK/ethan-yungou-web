FROM node:18

# 复制代码
COPY . /ethan-yungou-web

# 设置容器启动后的默认运行目录
WORKDIR /ethan-yungou-web


RUN npm install


CMD ["npm","start"]
