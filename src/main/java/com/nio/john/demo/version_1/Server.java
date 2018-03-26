/*
 *
 * 项目名：	com.nio.john.server
 * 文件名：	Server
 * 模块说明：
 * 修改历史：
 * 2018/3/22 - JOHN - 创建。
 */

package com.nio.john.demo.version_1;

import com.nio.john.RSA.RSAUtils;
import org.apache.commons.lang.StringUtils;

import java.io.IOException;
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
 * @date 2018/3/22
 */
public class Server implements Runnable {

    private Selector selector;

    private ServerSocketChannel serverChannel;

    private boolean isStop = false;

    private String data;

    private String privateKey;

    public Server(int port, String data, String privateKey) {
        this.data = data;
        this.privateKey = privateKey;

        try {
            serverChannel = ServerSocketChannel.open();
            serverChannel.configureBlocking(false);
            serverChannel.socket().bind(new InetSocketAddress(port), 1024);

            selector = Selector.open();
            serverChannel.register(selector, SelectionKey.OP_ACCEPT);
            System.out.println("This sever is already start in port : " + port);
        } catch (IOException e) {
            e.printStackTrace();
            System.exit(1);
        }
    }

    @Override
    public void run() {
        while (!isStop) {
            try{
                selector.select();
                Set<SelectionKey> selectionKeys = selector.selectedKeys();
                Iterator<SelectionKey> iterator = selectionKeys.iterator();
                SelectionKey selectionKey = null;
                while(iterator.hasNext()) {
                    selectionKey = iterator.next();
                    iterator.remove();
                    try {
                        handleInput(selectionKey);
                    } catch (Exception e) {
                        e.printStackTrace();
                        if(selectionKey != null){
                            selectionKey.cancel();
                            if(selectionKey.channel() != null){
                                selectionKey.channel().close();
                            }
                        }
                    }
                }
            } catch(IOException e) {
                e.printStackTrace();
            }
        }
    }

    private void handleInput(SelectionKey selectionKey) throws Exception {
        if(selectionKey.isValid()) {
            if(selectionKey.isAcceptable()) {
                ServerSocketChannel server = (ServerSocketChannel) selectionKey.channel();
                SocketChannel client = server.accept();
                client.configureBlocking(false);
                client.register(selector, SelectionKey.OP_READ);
            }

            if(selectionKey.isReadable()) {
                SocketChannel client = (SocketChannel) selectionKey.channel();
                ByteBuffer receiveBuffer = ByteBuffer.allocate(1024);
                int count = client.read(receiveBuffer);
                if(0 < count) {
                    receiveBuffer.flip();
                    byte[] bytes = new byte[receiveBuffer.remaining()];
                    receiveBuffer.get(bytes);
                    String body = new String(bytes, "UTF-8");
                    System.out.println("密文 : " + body);
                    String decodeData = RSAUtils.privateDecrypt(body, RSAUtils.getPrivateKey(privateKey));
                    System.out.println("明文 : " + decodeData);
                    doWrite(client, data);
                } else if (0 >= count) {
                    selectionKey.channel();
                    client.close();
                } else {

                }
            }
        }
    }

    private void doWrite(SocketChannel client, String data) throws Exception {
        if(null != client && StringUtils.isNotEmpty(data)) {
            ByteBuffer sendBuffer = ByteBuffer.allocate(2048);
            String encodeData = RSAUtils.privateEncrypt(data, RSAUtils.getPrivateKey(privateKey));
            sendBuffer.put(encodeData.getBytes());
            sendBuffer.flip();
            client.write(sendBuffer);
            System.out.println("服务器端向客户端发送数据--：" + encodeData);
        } else {
            System.out.println("没有数据");
        }
    }
}
