require('dotenv').config();
const { Telegraf } = require('telegraf');
const settings = require('./settings');

const bot = new Telegraf(settings.botToken);

// Import semua perintah dari folder "commands"
const menuCommand = require('./commands/menu');
const pingCommand = require('./commands/ping');
const ytsCommand = require('./commands/yts');
const downloadCommand = require('./commands/download');
const stickerCommand = require('./commands/sticker');
const groupCommand = require('./commands/group');
const adminCommand = require('./commands/admin');
const ownerCommand = require('./commands/owner');
const welcomeCommand = require('./commands/welcome');
const antiLinkCommand = require('./commands/anti_link');
const antiBotCommand = require('./commands/anti_bot');
const userManagementCommand = require('./commands/user_management');
const premiumCommand = require('./commands/premium');
const transactionCommand = require('./commands/transaction');
const panelCommand = require('./commands/panel');
const domainCommand = require('./commands/domain');

// Daftarkan perintah ke bot
bot.start(menuCommand);
bot.command('menu', menuCommand);
bot.command('ping', pingCommand);
bot.command('yts', ytsCommand);
bot.command('download', downloadCommand);
bot.command('sticker', stickerCommand);
bot.command('group', groupCommand);
bot.command('admin', adminCommand);
bot.command('owner', ownerCommand);
bot.on('new_chat_members', welcomeCommand);
bot.on('message', antiLinkCommand);
bot.on('message', antiBotCommand);
bot.command('user', userManagementCommand);
bot.command('premium', premiumCommand);
bot.command('transaction', transactionCommand);
bot.command('panel', panelCommand);
bot.command('domain', domainCommand);

const settings = require('./settings');

bot.command('owner', (ctx) => {
    if (ctx.from.id !== settings.ownerId) {
        return ctx.reply("🚫 Perintah ini hanya bisa digunakan oleh owner!");
    }
    ctx.reply("✅ Kamu adalah owner bot ini!");
});
// Menangani error agar bot tidak crash
bot.catch((err, ctx) => {
    console.error(`❌ Terjadi kesalahan di update ${ctx.updateType}:`, err);
});

// Jalankan bot
bot.launch().then(() => {
    console.log(`🤖 ${settings.botName} berjalan... jamgan lupa donasinya`);
});
