#!/bin/bash

echo "🔍 Проверка DNS записей для стримкэш.рф"
echo "======================================"

DOMAIN="xn--h1aefoeg0czb.xn--p1ai"
SERVER_IP="195.19.93.203"

echo ""
echo "📧 Проверка MX записи:"
dig MX $DOMAIN +short

echo ""
echo "🛡️  Проверка SPF записи:"
dig TXT $DOMAIN +short | grep spf

echo ""
echo "🔐 Проверка DKIM записи:"
dig TXT mail._domainkey.$DOMAIN +short

echo ""
echo "📋 Проверка DMARC записи:"
dig TXT _dmarc.$DOMAIN +short

echo ""
echo "🌐 A-запись для mail поддомена:"
dig A mail.$DOMAIN +short

echo ""
echo "🔄 Проверка PTR записи (reverse DNS):"
dig -x $SERVER_IP +short

echo ""
echo "ℹ️  Ваш внешний IP: $SERVER_IP"
echo ""
echo "📌 Что нужно настроить:"
echo "  MX:    $DOMAIN.    IN  MX  10  mail.$DOMAIN."
echo "  A:     mail.$DOMAIN.    IN  A   $SERVER_IP"
echo "  SPF:   $DOMAIN.    IN  TXT \"v=spf1 ip4:$SERVER_IP mx ~all\""
echo "  DKIM:  mail._domainkey.$DOMAIN. IN TXT \"v=DKIM1; k=rsa; p=КЛЮЧ_ИЗ_POSTE_IO\""
echo "  PTR:   $SERVER_IP   →  mail.$DOMAIN (настраивается у хостинг-провайдера)"
echo ""
echo "🚨 ВАЖНО: PTR запись настраивается в панели управления VPS/сервера!"
echo "   Она должна указывать: $SERVER_IP → mail.xn--h1aefoeg0czb.xn--p1ai"