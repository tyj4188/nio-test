/*
 *
 * 项目名：	com.nio.john.base64
 * 文件名：	ZipUtil
 * 模块说明：
 * 修改历史：
 * 2018/4/2 - JOHN - 创建。
 */

package com.nio.john.base64;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.zip.*;

/**
 * @author JOHN
 * @date 2018/4/2
 */
public class ZipUtil {

    /**
     *
     * 功能：使用gzip进行压缩，然后再用Base64进行编码
     * @param primStr 待压缩字符串
     * @return 返回压缩后字符串
     * @author zhanglinbo  20160827
     */
    @SuppressWarnings("restriction")
    public static String gzip(String primStr) {
        if (primStr == null || primStr.length() == 0) {
            return primStr;
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        GZIPOutputStream gzip = null;
        try {
            gzip = new GZIPOutputStream(out);
            gzip.write(primStr.getBytes());

        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (gzip != null) {
                try {
                    gzip.close();

                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }

        return  new sun.misc.BASE64Encoder().encode(out.toByteArray());
    }

    /**
     *
     * <p>
     * Description:使用gzip进行解压缩
     * 先对压缩数据进行BASE64解码。再进行Gzip解压
     * </p>
     *
     * @param compressedStr 压缩字符串
     * @return 返回解压字符串
     */
    @SuppressWarnings("restriction")
    public static String gunzip(String compressedStr) {
        if (compressedStr == null) {
            return null;
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayInputStream in = null;
        GZIPInputStream ginzip = null;
        byte[] compressed = null;
        String decompressed = null;
        try {
            compressed = new sun.misc.BASE64Decoder().decodeBuffer(compressedStr);
            in = new ByteArrayInputStream(compressed);
            ginzip = new GZIPInputStream(in);

            byte[] buffer = new byte[1024];
            int offset = -1;
            while ((offset = ginzip.read(buffer)) != -1) {
                out.write(buffer, 0, offset);
            }
            decompressed = out.toString();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (ginzip != null) {
                try {
                    ginzip.close();
                } catch (IOException e) {
                }
            }
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                }
            }
        }

        return decompressed;
    }

    /**
     * 使用zip进行压缩
     *
     * @param str
     *            压缩前的文本
     * @return 返回压缩后的文本
     */
    @SuppressWarnings("restriction")
    public static final String zip(String str) {
        if (str == null)
            return null;
        byte[] compressed;
        ByteArrayOutputStream out = null;
        ZipOutputStream zout = null;
        String compressedStr = null;
        try {
            out = new ByteArrayOutputStream();
            zout = new ZipOutputStream(out);
            zout.putNextEntry(new ZipEntry("0"));
            zout.write(str.getBytes());
            zout.closeEntry();
            compressed = out.toByteArray();
            compressedStr = new sun.misc.BASE64Encoder().encodeBuffer(compressed);
        } catch (IOException e) {
            compressed = null;
        } finally {
            if (zout != null) {
                try {
                    zout.close();
                } catch (IOException e) {
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                }
            }
        }
        return compressedStr;
    }

    /**
     * 使用zip进行解压缩
     *
     * @param compressedStr 压缩后的文本
     * @return 解压后的字符串
     */
    @SuppressWarnings("restriction")
    public static final String unzip(String compressedStr) {
        if (compressedStr == null) {
            return null;
        }

        ByteArrayOutputStream out = null;
        ByteArrayInputStream in = null;
        ZipInputStream zin = null;
        String decompressed = null;
        try {
            byte[] compressed = new sun.misc.BASE64Decoder().decodeBuffer(compressedStr);
            out = new ByteArrayOutputStream();
            in = new ByteArrayInputStream(compressed);
            zin = new ZipInputStream(in);
            zin.getNextEntry();
            byte[] buffer = new byte[1024];
            int offset = -1;
            while ((offset = zin.read(buffer)) != -1) {
                out.write(buffer, 0, offset);
            }
            decompressed = out.toString();
        } catch (IOException e) {
            decompressed = null;
            e.printStackTrace();
        } finally {
            if (zin != null) {
                try {
                    zin.close();
                } catch (IOException e) {
                }
            }
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                }
            }
        }
        return decompressed;
    }

    public static void main(String[] args) {
        String msg = "gÞï\u0010\u0002\u0006\u0002\u0080\u007F\u009F\u007F\u0007ê\bnêPTPVß^\\]A!Þsx\u0019\u001Dxe";

        //System.out.println(ZipUtil.gunzip(msg));
        System.out.println(ZipUtil.unzip(msg));
    }

}
