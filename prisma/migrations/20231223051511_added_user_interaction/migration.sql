-- CreateTable
CREATE TABLE "UserPostInteraction" (
    "userId" INTEGER NOT NULL,
    "postId" INTEGER NOT NULL,
    "going" BOOLEAN NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPostInteraction_userId_postId_key" ON "UserPostInteraction"("userId", "postId");

-- AddForeignKey
ALTER TABLE "UserPostInteraction" ADD CONSTRAINT "UserPostInteraction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPostInteraction" ADD CONSTRAINT "UserPostInteraction_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
