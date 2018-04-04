/*
 *
 * 项目名：	com.nio.john
 * 文件名：	Test
 * 模块说明：
 * 修改历史：
 * 2018/3/22 - JOHN - 创建。
 */

package com.nio.john.RSA;

import java.util.Map;

/**
 * @author JOHN
 * @date 2018/3/22
 */
public class Test {

    public static void main(String[] args) {
        try {
            Map<String, String> keyMap = RSAUtils.createKeys(1024);
            String privateKey = keyMap.get("privateKey");
            String publicKey = keyMap.get("publicKey");

            System.out.println("公钥: \n\r" + publicKey);
            System.out.println("私钥： \n\r" + privateKey);

            String str = "站在大明门前守卫的禁卫军，事先没有接到\n" +
                "有关的命令，但看到大批盛装的官员来临，也就\n" +
                "以为确系举行大典，因而未加询问。进大明门即\n" +
                "为皇城。文武百官看到端门午门之前气氛平静，\n" +
                "城楼上下也无朝会的迹象，既无几案，站队点名\n" +
                "的御史和御前侍卫“大汉将军”也不见踪影，不免\n" +
                "心中揣测，互相询问：所谓午朝是否讹传？";

            System.out.println("\r明文：\r\n" + str);
            System.out.println("\r明文大小：\r\n" + str.getBytes().length);

            String encodedData = RSAUtils.publicEncrypt(str, RSAUtils.getPublicKey(publicKey));
            System.out.println("密文：\r\n" + encodedData);

            String decodedData = RSAUtils.privateDecrypt(encodedData, RSAUtils.getPrivateKey(privateKey));
            System.out.println("解密后文字: \r\n" + decodedData);

        } catch (Exception e) {
            e.printStackTrace();
        }

    }
}
