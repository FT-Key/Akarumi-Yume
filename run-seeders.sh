#!/bin/bash
# =============================================================
# Script para ejecutar seeders del E-Commerce
# =============================================================

echo "🌱 E-Commerce Seeders"
echo "═══════════════════════════════════════════════════════"
echo ""

# Colores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para mostrar menú
show_menu() {
    echo "Selecciona qué seeder ejecutar:"
    echo ""
    echo "  1) 👥 Usuarios y Direcciones"
    echo "  2) 🛍️  Productos y Categorías"
    echo "  3) 🔄 Ambos (usuarios + productos)"
    echo "  4) ❌ Salir"
    echo ""
}

# Función para verificar que Node.js está instalado
check_node() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}❌ Node.js no está instalado${NC}"
        echo "Por favor instala Node.js desde https://nodejs.org"
        exit 1
    fi
}

# Función para verificar archivo .env
check_env() {
    if [ ! -f .env ]; then
        echo -e "${YELLOW}⚠️  Archivo .env no encontrado${NC}"
        echo "Creando .env desde .env.example..."
        if [ -f .env.example ]; then
            cp .env.example .env
            echo -e "${GREEN}✓ Archivo .env creado${NC}"
            echo -e "${YELLOW}⚠️  Por favor configura MONGODB_URI en .env antes de continuar${NC}"
            exit 1
        else
            echo -e "${RED}❌ Archivo .env.example no encontrado${NC}"
            exit 1
        fi
    fi
}

# Función para ejecutar seeder de usuarios
seed_users() {
    echo -e "${BLUE}👥 Ejecutando seeder de usuarios...${NC}"
    echo ""
    node src/seeders/seed-users.js
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Seeder de usuarios completado${NC}"
        return 0
    else
        echo ""
        echo -e "${RED}❌ Error en seeder de usuarios${NC}"
        return 1
    fi
}

# Función para ejecutar seeder de productos
seed_products() {
    echo -e "${BLUE}🛍️  Ejecutando seeder de productos...${NC}"
    echo ""
    node src/seeders/seed-products.js
    if [ $? -eq 0 ]; then
        echo ""
        echo -e "${GREEN}✅ Seeder de productos completado${NC}"
        return 0
    else
        echo ""
        echo -e "${RED}❌ Error en seeder de productos${NC}"
        return 1
    fi
}

# Verificaciones iniciales
check_node
check_env

# Si se pasa un argumento, ejecutar directamente
if [ ! -z "$1" ]; then
    case $1 in
        users)
            seed_users
            exit $?
            ;;
        products)
            seed_products
            exit $?
            ;;
        all)
            seed_users
            if [ $? -eq 0 ]; then
                echo ""
                sleep 2
                seed_products
                exit $?
            else
                exit 1
            fi
            ;;
        *)
            echo -e "${RED}❌ Opción inválida: $1${NC}"
            echo "Uso: $0 [users|products|all]"
            exit 1
            ;;
    esac
fi

# Menú interactivo
while true; do
    show_menu
    read -p "Opción: " choice
    echo ""
    
    case $choice in
        1)
            seed_users
            echo ""
            read -p "Presiona Enter para continuar..."
            clear
            ;;
        2)
            seed_products
            echo ""
            read -p "Presiona Enter para continuar..."
            clear
            ;;
        3)
            seed_users
            if [ $? -eq 0 ]; then
                echo ""
                sleep 2
                seed_products
            fi
            echo ""
            read -p "Presiona Enter para continuar..."
            clear
            ;;
        4)
            echo "👋 ¡Hasta luego!"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Opción inválida${NC}"
            sleep 1
            clear
            ;;
    esac
done
