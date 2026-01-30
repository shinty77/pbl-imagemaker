"use client";

import { VStack, Heading, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <VStack
      h="100vh"
      justify="center"
      align="center"
      gap={80}
      position="relative"
    >
      {/* タイトル */}
      <Heading fontSize="5xl">
        漫画風画像編集アプリ
      </Heading>

      {/* 真ん中のボタン */}
      <Button
        size="lg"
        px={12}
        py={6}
        fontSize="xl"
        onClick={() => router.push("/maker")}
        _hover={{ transform: "scale(1.05)" }}
        _active={{ transform: "scale(0.98)" }}
      >
        開始
      </Button>

      {/* 右下の名前 */}
      <Heading
        fontSize="3xl"
        position="absolute"
        bottom="20px"
        right="24px"
        opacity={0.6}
        fontWeight="normal"
      >
        Shinty
      </Heading>
    </VStack>
  );
}
