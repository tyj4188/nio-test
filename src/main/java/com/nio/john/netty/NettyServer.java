/* 版权所有(C)，上海海鼎信息工程股份有限公司，2018，所有权利保留。
 * 
 * 项目名：	com.nio.john.netty
 * 文件名：	NettyServer
 * 模块说明：	
 * 修改历史：
 * 2018/3/26 - Tyj - 创建。
 */

package com.nio.john.netty;

import com.nio.john.util.CONSTANT;
import io.netty.bootstrap.ServerBootstrap;
import io.netty.channel.ChannelFuture;
import io.netty.channel.ChannelInitializer;
import io.netty.channel.ChannelOption;
import io.netty.channel.EventLoopGroup;
import io.netty.channel.nio.NioEventLoopGroup;
import io.netty.channel.socket.ServerSocketChannel;
import io.netty.channel.socket.SocketChannel;

/**
 * @author Tyj
 * @date 2018/3/26
 */
public class NettyServer {

    public static void main(String[] args) {
        NettyServer server = new NettyServer();
        server.bind(CONSTANT.port);
    }


    public void bind(int port){
        // 用于处理客户端的连接
        EventLoopGroup acceptorGroup = new NioEventLoopGroup();
        // 用于 SocketChannel 的网络读写
        EventLoopGroup workGroup = new NioEventLoopGroup();
        try {
            // Netty 启动 NIO 的辅助启动类
            ServerBootstrap bootstrap = new ServerBootstrap();
            // 将两个 NIO 线程组传入辅助启动类中
            bootstrap.group(acceptorGroup, workGroup)
                // 设置创建 Channel 的类型
                .channel(ServerSocketChannel.class)
                // 设置参数
                .option(ChannelOption.SO_BACKLOG, 1024)
                // 设置 IO 事件的处理类
                .childHandler(new ChannelInitializer<SocketChannel>() {
                    @Override
                    protected void initChannel(SocketChannel socketChannel) throws Exception {
                        // 设置处理类为 ServerHandler
                        socketChannel.pipeline().addLast(new ServerHandler());
                    }
                });
            // bind()绑定端口, sync() 同步等待绑定成功
            // ChannelFuture 主要用于异步操作的通知回调
            ChannelFuture future = bootstrap.bind(port).sync();
            System.out.println("Server is already start in port 8080 !");

            // 等待服务端监听端口关闭
            future.channel().close().sync();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 释放资源
            acceptorGroup.shutdownGracefully();
            workGroup.shutdownGracefully();
        }
    }
}
