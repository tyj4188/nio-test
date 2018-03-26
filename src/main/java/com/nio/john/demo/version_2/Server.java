/*
 *
 * 项目名：	com.nio.john.netty
 * 文件名：	Server
 * 模块说明：
 * 修改历史：
 * 2018/3/26 - JOHN - 创建。
 */

package com.nio.john.demo.version_2;

import com.nio.john.util.CHARSET;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.InetSocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.SelectionKey;
import java.nio.channels.Selector;
import java.nio.channels.ServerSocketChannel;
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

/**
 * @author JOHN
 * @date 2018/3/26
 */
public class Server implements Runnable {

    private Selector selector;

    private ServerSocketChannel serverChannel;

    private boolean onOff;

    public Server() {
        onOff = true;
        try {
            // 初始化 Socket
            serverChannel = ServerSocketChannel.open();
            serverChannel.configureBlocking(false);
            serverChannel.socket().bind(new InetSocketAddress(8080));

            // 初始化 Selector
            selector = Selector.open();
            // 注册 Channel
            serverChannel.register(selector, SelectionKey.OP_ACCEPT);

            System.out.println("Server is already start in port 8080 !");
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(-1);
        }
    }

    @Override
    public void run() {

        while(onOff) {
            try {
                selector.select();
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                Iterator<SelectionKey> iterator = selectionKeys.iterator();
                SelectionKey selectionKey = null;
                while(iterator.hasNext()){
                    selectionKey = iterator.next();
                    iterator.remove(); // 防止重复处理

                    try {
                        handleInput(selectionKey);
                    } catch (IOException e) {
                        e.printStackTrace();
                        if(null != selectionKey) {
                            selectionKey.cancel(); // 取消操作
                            if(null != selectionKey.channel()) {
                                selectionKey.channel().close(); // 关闭管道
                            }
                        }
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    private void handleInput(SelectionKey selectionKey) throws IOException {
        if(null == selectionKey) {
            return;
        }
        if(selectionKey.isValid()) {
            // 处理连接事件
            if(selectionKey.isAcceptable()) {
                ServerSocketChannel server = (ServerSocketChannel) selectionKey.channel();
                SocketChannel client = server.accept();
                client.configureBlocking(false);
                client.register(selector, SelectionKey.OP_READ);
                System.out.println("");
            }
            // 处理读事件
            if(selectionKey.isReadable()) {
                SocketChannel client = (SocketChannel) selectionKey.channel();
                ByteBuffer buffer = ByteBuffer.allocate(1024);
                if(0 < client.read(buffer)) {
                    buffer.flip();
                    byte[] bytes = new byte[buffer.remaining()];
                    buffer.get(bytes);
                    String msg = new String(bytes, CHARSET.UTF_8.getValue());
                    System.out.println("客户端 : " + msg);
                    doWrite(client);
                }
            }
        }
    }

    private void doWrite(SocketChannel client) throws IOException {
        if(null != client) {
            System.out.printf("输入 : ");
            BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
            String msg = br.readLine();
            ByteBuffer buffer = ByteBuffer.allocate(1024);
            buffer.put(msg.getBytes());
            buffer.flip();
            client.write(buffer);
            System.out.println("服务端 : " + msg);
        }
    }
}
