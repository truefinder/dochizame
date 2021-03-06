#include <frida-core.h>

#include "spawnoptions.h"

static QVector<QString> parseStrv(gchar **strv, gint length);
static gchar **unparseStrv(QVector<QString> vector);

SpawnOptions::SpawnOptions(QObject *parent) :
    QObject(parent),
    m_handle(frida_spawn_options_new())
{
}

SpawnOptions::~SpawnOptions()
{
    g_object_unref(m_handle);
}

bool SpawnOptions::hasArgv() const
{
    return frida_spawn_options_get_argv(m_handle, nullptr) != nullptr;
}

QVector<QString> SpawnOptions::argv() const
{
    gint n;
    gchar **strv = frida_spawn_options_get_argv(m_handle, &n);
    return parseStrv(strv, n);
}

void SpawnOptions::setArgv(QVector<QString> argv)
{
    bool hadArgv = hasArgv();

    gchar **strv = unparseStrv(argv);
    frida_spawn_options_set_argv(m_handle, strv, argv.size());
    g_strfreev(strv);

    emit argvChanged(argv);
    if (!hadArgv)
        emit hasArgvChanged(true);
}

void SpawnOptions::unsetArgv()
{
    if (!hasArgv())
        return;
    frida_spawn_options_set_argv(m_handle, nullptr, 0);
    emit argvChanged(QVector<QString>());
    emit hasArgvChanged(false);
}

bool SpawnOptions::hasEnv() const
{
    return frida_spawn_options_get_env(m_handle, nullptr) != nullptr;
}

QVector<QString> SpawnOptions::env() const
{
    gint n;
    gchar **strv = frida_spawn_options_get_env(m_handle, &n);
    return parseStrv(strv, n);
}

void SpawnOptions::setEnv(QVector<QString> env)
{
    bool hadEnv = hasEnv();

    gchar **strv = unparseStrv(env);
    frida_spawn_options_set_env(m_handle, strv, env.size());
    g_strfreev(strv);

    emit envChanged(env);
    if (!hadEnv)
        emit hasEnvChanged(true);
}

void SpawnOptions::unsetEnv()
{
    if (!hasEnv())
        return;
    frida_spawn_options_set_env(m_handle, nullptr, 0);
    emit envChanged(QVector<QString>());
    emit hasEnvChanged(false);
}

bool SpawnOptions::hasCwd() const
{
    return frida_spawn_options_get_cwd(m_handle) != nullptr;
}

QString SpawnOptions::cwd() const
{
    const gchar *str = frida_spawn_options_get_cwd(m_handle);
    if (str == nullptr)
      return "";
    return QString::fromUtf8(str);
}

void SpawnOptions::setCwd(QString cwd)
{
    bool hadCwd = hasCwd();

    QByteArray str = cwd.toUtf8();
    frida_spawn_options_set_cwd(m_handle, str.data());

    emit cwdChanged(cwd);
    if (!hadCwd)
        emit hasCwdChanged(true);
}

void SpawnOptions::unsetCwd()
{
    if (!hasCwd())
        return;
    frida_spawn_options_set_cwd(m_handle, nullptr);
    emit cwdChanged("");
    emit hasCwdChanged(false);
}

static QVector<QString> parseStrv(gchar **strv, gint length)
{
    QVector<QString> result(length);
    for (gint i = 0; i != length; i++)
        result[i] = QString::fromUtf8(strv[i]);
    return result;
}

static gchar **unparseStrv(QVector<QString> vector)
{
    int n = vector.size();
    gchar **strv = g_new(gchar *, n + 1);

    for (int i = 0; i != n; i++) {
        QByteArray str = vector[i].toUtf8();
        strv[i] = g_strdup(str.data());
    }
    strv[n] = nullptr;

    return strv;
}
