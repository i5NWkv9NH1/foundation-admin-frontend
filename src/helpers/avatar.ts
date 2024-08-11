export function getRandomAvatar(phoneNumber: string): string {
  // 将手机号转换为唯一的数值
  const hash = Array.from(phoneNumber).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );

  // 使用 hash 生成稳定的图片编号，范围在 1 到 70 之间
  const imgNumber = (hash % 70) + 1;

  // 返回头像 URL
  return `https://i.pravatar.cc/150?img=${imgNumber}`;
}
