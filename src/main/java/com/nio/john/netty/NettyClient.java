/*
 *
 * 项目名：	com.nio.john.netty
 * 文件名：	NettyClient
 * 模块说明：
 * 修改历史：
 * 2018/3/27 - JOHN - 创建。
 */

package com.nio.john.netty;

import com.nio.john.util.CONSTANT;
import io.netty.bootstrap.Bootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioSocketChannel;

/**
 * @author JOHN
 * @date 2018/3/27
 */
public class NettyClient {
    public static void main(String[] args) {
        NettyClient client = new NettyClient();
        client.connect(CONSTANT.host, CONSTANT.port);
    }

    public void connect(String host, int port) {
        // 创建 NIO 的线程组
        EventLoopGroup group = new NioEventLoopGroup();

        try {
            // 创建客户端辅助启动类
            Bootstrap bootstrap = new Bootstrap();
            // 配置启动类
            bootstrap.group(group)
                .channel(NioSocketChannel.class)
                .option(ChannelOption.TCP_NODELAY, true)
                .handler(new ChannelInitializer<SocketChannel>() {
                    protected void initChannel(SocketChannel socketChannel) throws Exception {
                        // 设置具体处理逻辑的类
                        socketChannel.pipeline().addLast(new ClientHandler());
                    }
                });
            // 获取通知类, 同步连接
            ChannelFuture future = bootstrap.connect(host, port).sync();
            // 同步关闭
            future.channel().closeFuture().sync();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 释放资源
            group.shutdownGracefully();
        }
    }
}
