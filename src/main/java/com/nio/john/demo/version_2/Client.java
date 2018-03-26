/*
 *
 * 项目名：	com.nio.john.netty
 * 文件名：	Client
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
import java.nio.channels.SocketChannel;
import java.util.Iterator;
import java.util.Set;

/**
 * @author JOHN
 * @date 2018/3/26
 */
public class Client implements Runnable {

    private boolean onOff = true;

    private String host;

    private int port;

    private Selector selector;

    private SocketChannel socketChannel;

    public Client(String host, int port) {
        onOff = true;
        this.host = host;
        this.port = port;
        try {
            // 初始化 SocketChannel
            socketChannel = SocketChannel.open();
            socketChannel.configureBlocking(false);
            selector = Selector.open();
        } catch (Exception e) {
            e.printStackTrace();
            System.exit(-1);
        }
    }

    @Override
    public void run() {
        try {
            doConnect();
        } catch (IOException e) {
            e.printStackTrace();
        }

        while(this.onOff) {
            try {
                selector.select();
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                Iterator<SelectionKey> iterator = selectionKeys.iterator();
                SelectionKey selectionKey = null;
                while(iterator.hasNext()) {
                    selectionKey = iterator.next();
                    iterator.remove(); // 防止重复处理
                    receiveHandle(selectionKey);
                }
            } catch (IOException e) {
                e.printStackTrace();
                System.exit(1);
            }
        }
    }

    private void receiveHandle(SelectionKey selectionKey) throws IOException {
        if(null == selectionKey || !selectionKey.isValid()) { return; }

        SocketChannel client = (SocketChannel) selectionKey.channel();
        // 处理连接事件
        if(selectionKey.isConnectable()) {
            if(client.finishConnect()) {
                // 已经连接成功后重新注册监听读
                client.register(selector, SelectionKey.OP_READ);
                doWrite(client);
            }
        }

        if(selectionKey.isReadable()) {
            this.doRead(client);
            this.doWrite(client);
        }
    }

    private void doRead(SocketChannel client) throws IOException {
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        if(0 < client.read(buffer)) {
            buffer.flip();
            byte[] bytes = new byte[buffer.remaining()];
            buffer.get(bytes);
            String msg = new String(bytes, CHARSET.UTF_8.getValue());
            System.out.println("服务端 : " + msg);
        }
    }

    private void doWrite(SocketChannel client) throws IOException {
        System.out.printf("输入 : ");
        BufferedReader br = new BufferedReader(new InputStreamReader(System.in));
        String msg = br.readLine();
        ByteBuffer buffer = ByteBuffer.allocate(1024);
        buffer.put(msg.getBytes());
        buffer.flip();
        client.write(buffer);
        if(!buffer.hasRemaining()) {
            System.out.println("客户端 : " + msg);
        }
    }

    /**
     * 执行连接
     * @throws IOException
     */
    private void doConnect() throws IOException {
        // 异步连接
        boolean isConn = socketChannel.connect(new InetSocketAddress(host, port));
        // 连接成功监听读事件, 否则监听连接事件
        int stat = isConn ? SelectionKey.OP_READ : SelectionKey.OP_CONNECT;
        socketChannel.register(selector, stat);
    }
}
