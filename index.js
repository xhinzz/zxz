const { MessageEmbed } = require("discord.js");
const config = require('../../config.js')
const colors = require('../../utils/colors')
const superagent = require('superagent');

module.exports = {
    name: "marry",
    aliases: ["casar", "casado"],
    category: "Outhers",
  	description: "marry with member",
	  args: false,
    usage: "<member>",
    permission: [],
    owner: false,
    player: false,
    inVoiceChannel: false,
    sameVoiceChannel: false,
	 execute: async (message, args, client, prefix, db) => {

        const avatar = message.author.displayAvatarURL();
        const clientavatar = client.user.displayAvatarURL();
    
    
        if (!args[0]) {
    
            let ref = await db.ref(`Users/${message.author.id}`)
            let snap = await ref.once('value')
    
            let getMarry = snap.val().marry;
            let getDate = snap.val().date;
            
            let casado = message.author
    
            let casalAuthor = client.users.cache.get(getMarry)
    
    
           const solteiro = new MessageEmbed()
                .setAuthor(message.author.username, avatar)
                .setColor(colors.default)
                .setDescription(`> <a:fms_azul_babo:816817623441997836> **Você está Solteiro(a).**`)
                .setTimestamp()
    
                let casadoembed = new MessageEmbed()
                .setAuthor(message.author.username, avatar)
                .setColor(colors.default)
                .setDescription(` <a:a_tl1Heart_Blue:816815192733122582> **Você está casado(a) com:** ${getMarry} \n*${getDate}*`)
                .setTimestamp()
    
            if (getMarry === 0 ) return message.reply({embeds: [solteiro]})
    
    
    
            if ( getMarry !== 0 ) return message.reply({embeds: [casadoembed]})
            
    
             else return message.reply({embeds: [casadoembed]})
    
        } else {
    
            let ref = await db.ref(`Users/${message.author.id}`)
            let snap = await ref.once('value')
    
            let getMarry = snap.val().marry;
            let getDate = snap.val().date;
            let casalAuthor = client.users.cache.get(getMarry)
    
    
                let jacasado1 = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 1024}))
                .setColor(colors.default)
                .setDescription(`> **Você já está casado com:** ${casalAuthor}.`)
    
            if ( getMarry !== 0) return message.reply({embeds: [jacasado1]});
    
            const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    
            const target = message.mentions.users.first();
    
            const botembed = new MessageEmbed()
                .setTitle(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 1024}))
                .setDescription("Você não pode se casar com bots")
    
            if (target.bot) return message.reply({embeds: [botembed]})
            
            let refMember = await db.ref(`Users/${member.id}`)
            let snapMember = await refMember.once('value')
    
            if(snapMember.val() == null) {
    
                await db.ref(`Users/${member.id}`)
                .update({
                    marry: 0,
                    date: 0
                })
            };
            
            let getMarrymember = snapMember.val().marry
            let MemberMarried = client.users.cache.get(getMarrymember)
    
            if (!member) return message.reply('Mencione ou insira o ID do membro que deseja casar')
    
            const casarcmg = new MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL({dynamic: true, size: 1024}))
                .setColor(colors.default)
                .setDescription(`> **Você não pode casar com você mesmo.**`)
                .setTimestamp()
    
            if (member.id === message.author.id) return message.reply({embeds: [casarcmg]})
    
            const jacasado = new MessageEmbed()
                .setAuthor(client.user.username, clientavatar)
                .setColor(colors.default)
                .setDescription(`> ${member} **Já está casado(a) com:** ${MemberMarried} !`)
                .setTimestamp()
                .setFooter(client.user.username, client.user.displayAvatarURL({dynamic: true, size: 1024}))
            
    
            if (getMarrymember !== 0) return message.reply({embeds: [jacasado]});
    
            const accept = new MessageEmbed()
                .setAuthor(` Pedido de casamento de: ${message.author.username}`, message.author.avatarURL({ dynamic: true }))
                .setColor(colors.default)
                .setDescription(`> <a:a_tl1Heart_Blue:816815192733122582> ${member} Você aceita se casar com ${message.author.username} ?`)
                .setFooter(`Para aceitar digite "yes"`)
    
            const m = await message.channel.send({embeds: [accept]}); 
            const filter = m => m.author.id == target
    
            const collector = message.channel.createMessageCollector({ filter, time: 30000 });
    
            collector.on("collect", async (collected) => {
    
                if (collected.content.toLowerCase() === "yes" || collected.content.toLowerCase() === "sim") {
    
                    m.delete();
    
                    var months = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro","Novembro","Dezembro"];
                    const currentdate = new Date();
                    const datetime = `Desde:` + " " + currentdate.getDate() + " " + "de" + " " + months[currentdate.getMonth()] + " " + "de"  + " " + currentdate.getFullYear()
    
                    const acceptembed = new MessageEmbed()
                        .setColor(colors.default)
                        .setDescription(`> <a:a_tl1Heart_Blue:816815192733122582> Parabéns ao novo casal ${member} & ${message.author} <a:a_tl1Heart_Blue:816815192733122582>`)
                        .setFooter('Felicidades!!!')
    
                    message.channel.send({embeds: [acceptembed]});
    
                    await db.ref(`Users/${message.author.id}`)
                    .update({
                        marry: member.id,
                        date: datetime
                    });
    
                    await db.ref(`Users/${member.id}`)
                    .update({
                        marry: message.author.id,
                        date: datetime
                    })
    
                } else if (collected.content.toLowerCase() === "no" || collected.content.toLowerCase() === "nao" || collected.content.toLowerCase() === "não") {
    
                    m.delete();
    
                    const noembed1 = new MessageEmbed()
                        .setAuthor(client.user.username, clientavatar)
                        .setColor(colors.default)
                        .setDescription("Infelizmente não foi dessa vez, mas quem sabe na próxima né...")
                        .setFooter("Triste");
                    message.channel.send({embeds: [noembed1]})
                }
            });
    
            collector.on("end", async collected => {
    
                const noembed = new MessageEmbed()
                    .setColor(colors.default)
                    .setDescription("Vixi, infelizmente a pessoa não aceitou, mas quem sabe na próxima")
                    .setFooter("Triste");
    
                if (collected.size === 0) {
                    m.delete();
                    return message.channel.send({embeds: [noembed]})
                }
            })
        }
    }
    }
