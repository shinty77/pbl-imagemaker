"use client";

import React, { useRef, useEffect, useState } from "react";
import { Box, Button, Input, VStack, HStack } from "@chakra-ui/react";

type MenuType = "shape" | "text" | "canvas" | null;

export default function MakerPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricRef = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [fabricLib, setFabricLib] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<MenuType>(null);
  const [text, setText] = useState("");
  const [vertical, setVertical] = useState(false);
  const [isPortrait, setIsPortrait] = useState(true);

  const CANVAS_RATIO = isPortrait ? { w: 2, h: 3 } : { w: 3, h: 2 };

  /* ===== 動的 import Fabric ===== */
  useEffect(() => {
    import("fabric").then((mod) => setFabricLib(mod.fabric));
  }, []);

  /* ===== Canvas 初期化 ===== */
  useEffect(() => {
    if (!canvasRef.current || !fabricLib) return;

    const canvas = new fabricLib.Canvas(canvasRef.current, {
      backgroundColor: "#fff",
      preserveObjectStacking: true,
    });

    const resizeCanvas = () => {
      const maxH = window.innerHeight - 64 - 24 * 2;
      const maxW = window.innerWidth - 24 * 2;
      let height = maxH;
      let width = (height * CANVAS_RATIO.w) / CANVAS_RATIO.h;
      if (width > maxW) {
        width = maxW;
        height = (width * CANVAS_RATIO.h) / CANVAS_RATIO.w;
      }
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.calcOffset();
      canvas.renderAll();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    fabricRef.current = canvas;

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      canvas.dispose();
    };
  }, [fabricLib, isPortrait]);

  /* ===== Delete / Backspace ===== */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Delete" || e.key === "Backspace") removeSelected();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ===== 図形 ===== */
  const addRect = () => {
    const canvas = fabricRef.current;
    if (!canvas || !fabricLib) return;

    const rect = new fabricLib.Rect({
      left: 60,
      top: 60,
      width: 120,
      height: 80,
      fill: "#fff",
      stroke: "black",
      selectable: true,
      hasControls: true,
    });

    canvas.add(rect);
    canvas.setActiveObject(rect);
  };

  const addCircle = () => {
    const canvas = fabricRef.current;
    if (!canvas || !fabricLib) return;

    const circle = new fabricLib.Circle({
      left: 100,
      top: 100,
      radius: 40,
      fill: "#fff",
      stroke: "black",
      selectable: true,
      hasControls: true,
    });

    canvas.add(circle);
    canvas.setActiveObject(circle);
  };

  const addLine = () => {
    const canvas = fabricRef.current;
    if (!canvas || !fabricLib) return;

    const line = new fabricLib.Line([50, 50, 200, 50], {
      stroke: "#2d3748",
      strokeWidth: 4,
      selectable: true,
      hasControls: true,
    });

    canvas.add(line);
    canvas.setActiveObject(line);
  };

  /* ===== 吹き出し ===== */
  const addSpeechBubble = () => {
    const canvas = fabricRef.current;
    if (!canvas || !fabricLib) return;

    const path = new fabricLib.Path(
      `
      M 20 20
      Q 20 0 40 0
      L 180 0
      Q 200 0 200 20
      L 200 80
      Q 200 100 180 100
      L 80 100
      L 60 120
      L 50 100
      L 40 100
      Q 20 100 20 80
      Z
      `,
      { fill: "#fff", stroke: "#222", strokeWidth: 2, objectCaching: false }
    );

    const group = new fabricLib.Group([path], {
      left: 120,
      top: 120,
      selectable: true,
      hasControls: true,
    });

    canvas.add(group);
    canvas.setActiveObject(group);
  };

  const addJaggedSpeechBubble = () => {
    const canvas = fabricRef.current;
    if (!canvas || !fabricLib) return;

    const cx = canvas.getWidth() / 2;
    const cy = canvas.getHeight() / 2;
    const outerR = 80;
    const innerR = 55;
    const spikes = 14;

    const points: { x: number; y: number }[] = [];
    let angle = -Math.PI / 2;
    const step = Math.PI / spikes;

    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      points.push({ x: Math.cos(angle) * r, y: Math.sin(angle) * r });
      angle += step;
    }

    const bubble = new fabricLib.Polygon(points, {
      left: cx,
      top: cy,
      originX: "center",
      originY: "center",
      fill: "#fff",
      stroke: "#000",
      strokeWidth: 2,
      objectCaching: false,
      selectable: true,
      hasControls: true,
    });

    canvas.add(bubble);
    canvas.setActiveObject(bubble);
  };

  /* ===== テキスト ===== */
  const addText = () => {
    const canvas = fabricRef.current;
    if (!canvas || !fabricLib || !text) return;

    const content = vertical ? text.split("").join("\n") : text;

    const textbox = new fabricLib.Textbox(content, {
      left: 80,
      top: 80,
      fontSize: 24,
      selectable: true,
      hasControls: true,
    });

    canvas.add(textbox);
    canvas.setActiveObject(textbox);
  };

  /* ===== 削除 ===== */
  const removeSelected = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    canvas.getActiveObjects().forEach((obj) => canvas.remove(obj));
    canvas.discardActiveObject();
    canvas.requestRenderAll();
  };

  /* ===== 保存 ===== */
  const saveImage = () => {
    const canvas = fabricRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL({ format: "png", multiplier: 1 });
    const a = document.createElement("a");
    a.href = url;
    a.download = "canvas.png";
    a.click();
  };

  /* ===== ユーザー画像追加 ===== */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const canvas = fabricRef.current;
    if (!canvas || !fabricLib) return;

    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target?.result as string;

      fabricLib.Image.fromURL(url, (img: any) => {
        const maxWidth = canvas.getWidth() * 0.8;
        const maxHeight = canvas.getHeight() * 0.8;
        let scale = 1;
        if (img.width && img.height) {
          scale = Math.min(maxWidth / img.width, maxHeight / img.height);
        }

        img.set({
          left: canvas.getWidth() / 2,
          top: canvas.getHeight() / 2,
          originX: "center",
          originY: "center",
          scaleX: scale,
          scaleY: scale,
          selectable: true,
          hasControls: true,
        });

        canvas.add(img);
        canvas.setActiveObject(img);
        canvas.renderAll();
      });
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <Box h="100vh" overflow="hidden" position="relative">
      {/* ツールバー */}
      <HStack h="64px" px={4} bg="gray.100" gap={2}>
        <Button onClick={() => setActiveMenu(activeMenu === "shape" ? null : "shape")}>図形</Button>
        <Button onClick={() => setActiveMenu(activeMenu === "text" ? null : "text")}>テキスト</Button>
        <Button onClick={() => setActiveMenu(activeMenu === "canvas" ? null : "canvas")}>キャンバス</Button>
        <Button colorScheme="red" onClick={removeSelected}>削除</Button>
        <Button colorScheme="blue" onClick={triggerFileSelect}>画像追加</Button>
        <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileChange} />
      </HStack>

      {/* サブメニュー */}
      {activeMenu && (
        <Box position="absolute" top="64px" left={4} bg="white" border="1px solid #ccc" p={3}>
          {activeMenu === "shape" && (
            <VStack align="stretch">
              <Button onClick={addRect}>四角</Button>
              <Button onClick={addCircle}>円</Button>
              <Button onClick={addLine}>線</Button>
              <Button onClick={addSpeechBubble}>丸吹き出し</Button>
              <Button onClick={addJaggedSpeechBubble}>ギザギザ吹き出し</Button>
            </VStack>
          )}
          {activeMenu === "text" && (
            <VStack align="stretch">
              <Input placeholder="テキスト" value={text} onChange={(e) => setText(e.target.value)} />
              <Button onClick={() => setVertical(!vertical)}>{vertical ? "縦書き" : "横書き"}</Button>
              <Button onClick={addText}>追加</Button>
            </VStack>
          )}
          {activeMenu === "canvas" && (
            <VStack align="stretch">
              <Button onClick={() => setIsPortrait(!isPortrait)}>縦 / 横 切替</Button>
              <Button colorScheme="green" onClick={saveImage}>画像を保存</Button>
            </VStack>
          )}
        </Box>
      )}

      {/* Canvas */}
      <Box h="calc(100vh - 64px)" display="flex" justifyContent="center" alignItems="center" bg="gray.50">
        <Box border="2px solid black">
          <canvas ref={canvasRef} />
        </Box>
      </Box>
    </Box>
  );
}
