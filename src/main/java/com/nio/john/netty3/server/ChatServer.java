/*
 *
 * 项目名：	com.nio.john.netty3.server
 * 文件名：	ChatServer
 * 模块说明：
 * 修改历史：
 * 2018/4/11 - JOHN - 创建。
 */

package com.nio.john.netty3.server;

import com.nio.john.netty3.server.handler.SFPDecoder;
import com.nio.john.netty3.server.handler.SFPEncoder;
import com.nio.john.netty3.server.handler.SFPHandler;
import com.nio.john.util.CONSTANT;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.SocketChannel;
import io.netty.channel.socket.nio.NioServerSocketChannel;

/**
 * @author JOHN
 * @date 2018/4/11
 */
public class ChatServer {
    public static void main(String[] args) throws Exception {
        new ChatServer().bind(CONSTANT.port);
    }

    public void bind(int port) throws Exception {
        // 创建 boss/work 线程组
        EventLoopGroup bossGroup = new NioEventLoopGroup();
        EventLoopGroup workGroup = new NioEventLoopGroup();

        ServerBootstrap bootstrap = new ServerBootstrap();

        try {
            bootstrap.group(bossGroup, workGroup)
                // 使用 NIO
                .channel(NioServerSocketChannel.class)
                // 因为是单线程顺序处理客户端请求, 多个客户端同时请求时需要排队
                // SO_BACKLOG 指定客户端连接的等待队列大小
                // TCP_NODELAY 用来禁止使用Nagle算法
                .option(ChannelOption.SO_BACKLOG, 128)
                // 当设置该选项以后，连接会测试链接的状态，这个选项用于可能长时间没有数据交流的连接
                .childOption(ChannelOption.SO_KEEPALIVE, true)
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel ch) throws Exception {
                        ch.pipeline().addLast(new SFPDecoder())
                            .addLast(new SFPEncoder())
                            .addLast(new SFPHandler());
                    }
                });
            // 设置同步连接
            ChannelFuture future = bootstrap.bind(port).sync();
            System.out.println("服务端启动 - 端口" + port);
            // 同步等待客户端关闭
            future.channel().closeFuture().sync();
        } finally {
            // 关闭资源
            bossGroup.shutdownGracefully();
            workGroup.shutdownGracefully();
        }
    }
}
